import * as CDK from "aws-cdk-lib"
import * as Route53 from "aws-cdk-lib/aws-route53"
import * as Route53Targets from "aws-cdk-lib/aws-route53-targets"
import * as S3 from "aws-cdk-lib/aws-s3"
import * as CloudFront from "aws-cdk-lib/aws-cloudfront"
import * as Iam from "aws-cdk-lib/aws-iam"
import { Construct } from "constructs"
import { IConfig } from "./config"
import { ServiceApi } from "./ServiceAPI"

export interface ServiceCRMStackProps extends CDK.StackProps {
  config: IConfig
}

export class ServiceCRMStack extends CDK.Stack {
  constructor(scope: Construct, id: string, props: ServiceCRMStackProps) {
    super(scope, id, props)

    const { config } = props

    new ServiceApi(this, id, {
      config,
    })

    if (config.domainName) {
      // creating bucket for hosting the front end
      const bucket = new S3.Bucket(this, "web", {
        accessControl: S3.BucketAccessControl.PRIVATE,
        //autoDeleteObjects: true,
        bucketName: config.domainName,
        cors: [
          {
            allowedHeaders: ["*"],
            allowedMethods: [S3.HttpMethods.GET],
            allowedOrigins: ["*"],
          },
        ],
        encryption: S3.BucketEncryption.S3_MANAGED,
        publicReadAccess: false,
        removalPolicy: CDK.RemovalPolicy.RETAIN,
        websiteErrorDocument: "index.html",
        websiteIndexDocument: "index.html",
        websiteRoutingRules: [
          {
            condition: {
              httpErrorCodeReturnedEquals: "403",
            },
            replaceKey: {
              prefixWithKey: "#/",
            },
          },
          {
            condition: {
              httpErrorCodeReturnedEquals: "404",
            },
            replaceKey: {
              prefixWithKey: "#/",
            },
          },
        ],
      })

      new CDK.CfnOutput(this, "web-bucket", {
        value: bucket.bucketName,
      })
    }
  }
}
