import * as CDK from "aws-cdk-lib"
import * as ApiGateway from "aws-cdk-lib/aws-apigateway"
import * as Dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as Iam from "aws-cdk-lib/aws-iam"
import * as Lambda from "aws-cdk-lib/aws-lambda"
import * as Logs from "aws-cdk-lib/aws-logs"
import * as S3 from "aws-cdk-lib/aws-s3"
import { IConfig } from "./config"
import {
  CRM_PROPERTY_TABLE_CREATE_DATE_INDEX,
  CRM_PROPERTY_TABLE_STATE_INDEX,
  CRM_PROPERTY_TABLE_SUBURB_INDEX,
  CRM_TABLE_EMAIL_INDEX,
  CRM_TABLE_LAST_EDIT_INDEX,
  CRM_TABLE_NAME_INDEX,
  CRM_TABLE_PHONE_INDEX,
} from "./constants"

import * as Cognito from "aws-cdk-lib/aws-cognito"


export interface ServiceApiProps {
  config: IConfig
  zone?: CDK.aws_route53.IHostedZone
}

export const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID
console.log("AWS_ACCOUNT_ID = ", AWS_ACCOUNT_ID)
if (AWS_ACCOUNT_ID == "") {
  throw new Error("Can't find env variable AWS_ACCOUNT_ID.")
}

// TODO: Change to Construct, results in destroy the stack
export class ServiceApi {
  apigateway: ApiGateway.RestApi
  domain: ApiGateway.DomainName
  userPool: Cognito.IUserPool
  userPoolClient: Cognito.UserPoolClient

  constructor(scope: CDK.Stack, stackName: string, props: ServiceApiProps) {
    const { config, zone } = props

    // S3
    const bucketName = config.bucket_name
    if (!bucketName) {
      throw new Error("Can't find bucket name from config")
    }
    console.log("Using S3 Bucket name: ", bucketName)
    const bucketCRM = S3.Bucket.fromBucketName(scope, "CRM-Bucket", bucketName)

    // Define the bucket policy
    const bucketPolicy = new S3.BucketPolicy(scope, "MyBucketPolicy", {
      bucket: bucketCRM,
    })

    bucketPolicy.document.addStatements(
      new Iam.PolicyStatement({
        actions: ["s3:PutObject", "s3:PutObjectAcl", "s3:GetObject", "s3:GetObjectAcl", "s3:DeleteObject"],
        resources: [bucketCRM.arnForObjects("*")],
        principals: [new Iam.AnyPrincipal()],
      })
    )

    // CRM Table
    const tableName = config.dynamodb_table_name
    const arnCRM = `arn:aws:dynamodb:${config.aws_region}:${AWS_ACCOUNT_ID}:table/${tableName}`
    console.log("Using DynamoDB ARN: ", arnCRM)

    const dbCRM = Dynamodb.Table.fromTableArn(scope, "CRM_Table", arnCRM)
    const dbNameIndex = Dynamodb.Table.fromTableArn(scope, "CRM_Table_Name", `${arnCRM}/index/${CRM_TABLE_NAME_INDEX}`)
    const dbEmailIndex = Dynamodb.Table.fromTableArn(scope, "CRM_Table_Email", `${arnCRM}/index/${CRM_TABLE_EMAIL_INDEX}`)
    const dbPhoneIndex = Dynamodb.Table.fromTableArn(scope, "CRM_Table_Phone", `${arnCRM}/index/${CRM_TABLE_PHONE_INDEX}`)
    const dbDateIndex = Dynamodb.Table.fromTableArn(scope, "CRM_Table_Date", `${arnCRM}/index/${CRM_TABLE_LAST_EDIT_INDEX}`)

    // Property Table
    const arnProperty = `arn:aws:dynamodb:${config.aws_region}:${AWS_ACCOUNT_ID}:table/${config.dynamodb_table_name}-Property`
    const dbProperty = Dynamodb.Table.fromTableArn(scope, "CRM_Property_Table", arnProperty)
    const dbPropertyDateIndex = Dynamodb.Table.fromTableArn(scope, "CRM_Property_Date", `${arnProperty}/index/${CRM_PROPERTY_TABLE_CREATE_DATE_INDEX}`)
    const dbPropertySuburbIndex = Dynamodb.Table.fromTableArn(scope, "CRM_Property_Suburb", `${arnProperty}/index/${CRM_PROPERTY_TABLE_SUBURB_INDEX}`)
    const dbPropertyStateIndex = Dynamodb.Table.fromTableArn(scope, "CRM_Property_State", `${arnProperty}/index/${CRM_PROPERTY_TABLE_STATE_INDEX}`)

    // apigateway
    this.apigateway = new ApiGateway.RestApi(scope, "api", {
      restApiName: stackName,
      description: "API for CRM Service",
      deployOptions: {
        stageName: "prod",
        loggingLevel: ApiGateway.MethodLoggingLevel.ERROR,
        dataTraceEnabled: true,
        metricsEnabled: true,
        tracingEnabled: true,
      },
      deploy: true,
    })

    // common lambda props
    const commonLambdaProps = {
      runtime: Lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      logRetention: Logs.RetentionDays.ONE_DAY,
      timeout: CDK.Duration.seconds(60),
      tracing: Lambda.Tracing.PASS_THROUGH,
      memorySize: 128,
    }

    //endpoint: /agent
    const poolId = config.cognito_pool_id
    if (!poolId) {
      throw new Error("Cant find Cognito pool id from config")
    }
    // this.userPool = new cognito.UserPool(scope, `${stackName}UserPool`);   // create Cognito User Pool
    this.userPool = Cognito.UserPool.fromUserPoolId(scope, "ExistingUserPool", poolId)
    this.userPoolClient = new Cognito.UserPoolClient(scope, "UserPoolClient", {
      userPool: this.userPool,
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userSrp: true,
      },
    })

    {
      const lambda = new Lambda.Function(scope, "agent", {
        ...commonLambdaProps,
        functionName: `${stackName}-service-agent`,
        code: Lambda.Code.fromAsset(".build/lambdas/agent"),
        environment: {
          USER_POOL_ID: poolId,
          USER_POOL_CLIENT_ID: this.userPoolClient.userPoolClientId,
        },
      })

      const executionRole = lambda.role as Iam.Role

      executionRole.addToPolicy(
        new Iam.PolicyStatement({
          actions: [
            "cognito-idp:AdminCreateUser",
            "cognito-idp:ListUsers",
            "cognito-idp:AdminInitiateAuth",
            "cognito-idp:AdminRespondToAuthChallenge",
            "cognito-idp:AdminSetUserPassword",
            "cognito-idp:AdminGetUser",
            "cognito-idp:AdminUpdateUserAttributes",
          ],
          effect: Iam.Effect.ALLOW,
          resources: [`arn:aws:cognito-idp:ap-southeast-2:*:userpool/ap-southeast-2_X7nibxiuU`],
        })
      )

      const agentResource = this.apigateway.root.addResource("agent")
      ServiceApi.addMethodsToResource(agentResource, ["GET", "POST", "PUT", "OPTIONS"], lambda)

      //endpoint: /agent/login
      const agentLogin = agentResource.addResource("login")
      ServiceApi.addMethodsToResource(agentLogin, ["POST"], lambda)

      //endpoint: /agent/change-password
      const changePassword = agentResource.addResource("change-password")
      ServiceApi.addMethodsToResource(changePassword, ["POST"], lambda)

      this.grantAccess(lambda, "FULL", [])
    }

    // endpoint: /settings
    const settingsResource = this.apigateway.root.addResource("settings")
    {
      const lambda = new Lambda.Function(scope, "settings", {
        ...commonLambdaProps,
        functionName: `${stackName}-service-settings`,
        code: Lambda.Code.fromAsset(".build/lambdas/settings"),
        environment: {
          CRM_TABLE_NAME: config.dynamodb_table_name,
        },
      })
      ServiceApi.addMethodsToResource(settingsResource, ["GET", "POST", "PUT", "OPTIONS"], lambda)

      // endpoint: /settings/{name}/
      const settings = settingsResource.addResource("{name}")
      ServiceApi.addMethodsToResource(settings, ["GET", "DELETE", "OPTIONS"], lambda)

      this.grantAccess(lambda, "FULL", [dbCRM, dbNameIndex])
    }

    // endpoint: /property
    const propertyResource = this.apigateway.root.addResource("property")
    {
      const lambda = new Lambda.Function(scope, "property", {
        ...commonLambdaProps,
        functionName: `${stackName}-service-property`,
        code: Lambda.Code.fromAsset(".build/lambdas/property"),
        environment: {
          CRM_PROPERTY_TABLE_NAME: `${config.dynamodb_table_name}-Property`,
        },
      })
      ServiceApi.addMethodsToResource(propertyResource, ["GET", "POST", "OPTIONS"], lambda)
      // endpoint: /property/{id}/
      const property = propertyResource.addResource("{id}")
      ServiceApi.addMethodsToResource(property, ["GET", "PUT", "DELETE", "OPTIONS"], lambda)
      //endpoint: /property/search
      const search = propertyResource.addResource("search")
      search.addMethod("GET", new ApiGateway.LambdaIntegration(lambda))
      search.addMethod("OPTIONS", new ApiGateway.LambdaIntegration(lambda))

      this.grantAccess(lambda, "FULL", [dbProperty, dbPropertyDateIndex, dbPropertyStateIndex, dbPropertySuburbIndex])
    }

    // endpoint: /file
    const fileResource = this.apigateway.root.addResource("file")
    {
      const lambda = new Lambda.Function(scope, "file", {
        ...commonLambdaProps,
        functionName: `${stackName}-service-file`,
        code: Lambda.Code.fromAsset(".build/lambdas/file"),
        environment: {
          CRM_PROPERTY_TABLE_NAME: `${config.dynamodb_table_name}-Property`,
          CRM_BUCKET_NAME: `${config.bucket_name}`,
        },
      })
      ServiceApi.addMethodsToResource(fileResource, ["GET", "POST", "DELETE", "OPTIONS"], lambda)
      //endpoint: /file/upload
      const imageUploadUrls = fileResource.addResource("upload")
      imageUploadUrls.addMethod("GET", new ApiGateway.LambdaIntegration(lambda))
      imageUploadUrls.addMethod("OPTIONS", new ApiGateway.LambdaIntegration(lambda))
      // endpoint: /file/{id}/
      const file = fileResource.addResource("{id}")
      ServiceApi.addMethodsToResource(file, ["GET", "PUT", "DELETE", "OPTIONS"], lambda)

      this.grantAccess(lambda, "FULL", [dbProperty, dbPropertyDateIndex, dbPropertyStateIndex, dbPropertySuburbIndex])
      bucketCRM.grantReadWrite(lambda)
    }
  }

  private static addMethodsToResource(
    resource: CDK.aws_apigateway.Resource,
    methods: string[],
    lambda: CDK.aws_lambda.Function,
    options?: CDK.aws_apigateway.MethodOptions
  ) {
    methods.forEach((method) => {
      resource.addMethod(method, new ApiGateway.LambdaIntegration(lambda), options)
    })
  }

  private grantAccess(lambda: CDK.aws_lambda.Function, access: "FULL" | "READ", tables: CDK.aws_dynamodb.ITable[]) {
    tables.forEach((table) => {
      if (access == "FULL") table.grantFullAccess(lambda)
      if (access == "READ") table.grantReadData(lambda)
    })
  }
}
