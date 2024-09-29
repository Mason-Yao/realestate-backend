export interface IConfig {
  readonly aws_region: string
  readonly environment: string
  readonly dynamodb_table_name: string
  readonly domainName?: string
  readonly service_api_url?: string
  readonly certificateArnGlobal?: string
  readonly certificateArnSydney?: string
  readonly zoneId?: string
  readonly zoneDomain?: string
  readonly bucket_name?: string
  readonly cognito_pool_id?: string
}
