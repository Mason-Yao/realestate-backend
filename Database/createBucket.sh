#!/bin/bash
if [ "${CRM_ENV}" == "" ]; then
    echo "Error: CRM_ENV is not defined"
    exit -1
fi

BUCKET_NAME="crm-files.cyberlark.com.au"
if [ "${CRM_ENV}" != "prod" ]; then
    BUCKET_NAME="crm-${CRM_ENV}-files.cyberlark.com.au"
fi

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && (pwd -W 2> /dev/null || pwd))

aws s3api create-bucket \
    --bucket ${BUCKET_NAME} \
    --region ap-southeast-2 \
    --create-bucket-configuration LocationConstraint=ap-southeast-2

aws s3api put-public-access-block \
    --bucket ${BUCKET_NAME} \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

aws s3api put-bucket-cors --bucket ${BUCKET_NAME} --cors-configuration file://${SCRIPT_DIR}/bucketCORS.json