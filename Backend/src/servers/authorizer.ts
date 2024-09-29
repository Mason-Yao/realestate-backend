import * as CDK from "aws-cdk-lib"
import * as Iam from "aws-cdk-lib/aws-iam"
import * as Lambda from "aws-cdk-lib/aws-lambda"
import * as ApiGateway from "aws-cdk-lib/aws-apigateway"
import * as Logs from "aws-cdk-lib/aws-logs"
import { Construct } from "constructs"

export class Authorizer extends Construct implements ApiGateway.IAuthorizer {
  readonly lambda: Lambda.Function
  private authorizer: ApiGateway.CfnAuthorizer
  constructor(scope: Construct, namePrefix: string, restApi: ApiGateway.RestApi, tableName: string) {
    super(scope, namePrefix)

    this.lambda = new Lambda.Function(this, "lambda-authorizer", {
      functionName: `${namePrefix}-authorizer`,
      runtime: Lambda.Runtime.NODEJS_18_X,
      code: Lambda.Code.fromAsset("./.build/lambdas/authorizer"),
      handler: "index.handler",
      logRetention: Logs.RetentionDays.ONE_DAY,
      timeout: CDK.Duration.seconds(60),
      tracing: Lambda.Tracing.PASS_THROUGH,
      memorySize: 128,
      environment: {
        GW_ARN: restApi.arnForExecuteApi(),
        CRM_TABLE_NAME: tableName,
      },
    })

    const lambdaPermissionStatement = new Iam.PolicyStatement({
      actions: ["lambda:invokeFunction"],
      resources: [this.lambda.functionArn],
    })

    const apigatewayPermissionStatement = new Iam.PolicyStatement({
      actions: ["execute-api:Invoke"],
      effect: Iam.Effect.ALLOW,
      resources: [restApi.arnForExecuteApi()],
    })

    const authPolicyDocument = new Iam.PolicyDocument({
      statements: [lambdaPermissionStatement, apigatewayPermissionStatement],
    })

    const authRole = new Iam.Role(this, "authorizerRole", {
      assumedBy: new Iam.ServicePrincipal("apigateway.amazonaws.com"),
      inlinePolicies: { authPolicyDocument },
      roleName: `${namePrefix}-auth-role`,
    })

    const region = CDK.Stack.of(this).region
    this.authorizer = new ApiGateway.CfnAuthorizer(this, "authorizer", {
      authorizerCredentials: authRole.roleArn,
      authorizerResultTtlInSeconds: 60, // cache timeout
      authorizerUri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${this.lambda.functionArn}/invocations`,
      identitySource: "method.request.header.Authorization",
      name: `${namePrefix}-authorizer`,
      restApiId: restApi.restApiId,
      type: "TOKEN",
    })
  }

  get authorizerId(): string {
    return this.authorizer.ref
  }

  get methodOptions(): ApiGateway.MethodOptions {
    return {
      authorizationType: ApiGateway.AuthorizationType.CUSTOM,
      authorizer: this,
    }
  }
}
