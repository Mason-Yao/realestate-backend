import { DeleteObjectCommand, DeleteObjectCommandOutput, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { logger } from "../../../../Shared/Utils/logger"

export interface S3Output {
  statusCode: number
  data?: {
    url?: string
  }
  errorMessage?: string
}

export default class S3 {
  client: S3Client
  bucketName: string

  constructor(bucketName: string) {
    this.client = new S3Client()
    this.bucketName = bucketName
  }

  async getPresignedUrl(path: string, props?: PutObjectCommand): Promise<S3Output> {
    const command = new PutObjectCommand({ Bucket: this.bucketName, Key: path, ...props })

    try {
      const uploadURL = await getSignedUrl(this.client, command, { expiresIn: 1800 })
      return {
        statusCode: 200,
        data: {
          url: uploadURL,
        },
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  async deleteObject(path: string, props?: DeleteObjectCommand): Promise<S3Output> {
    const bucketParams = { Bucket: this.bucketName, Key: path, ...props }
    try {
      const response = await this.client.send(new DeleteObjectCommand(bucketParams))
      logger.info("[S3] S3 Delete: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
      }
    } catch (err) {
      logger.error("[S3] S3 Delete error: " + JSON.stringify(err))
      return {
        statusCode: 500,
        errorMessage: (err as Error).stack,
      }
    }
  }
}
