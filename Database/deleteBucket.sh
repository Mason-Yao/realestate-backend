#!/bin/bash
if [ "${CRM_ENV}" == "" ]; then
    echo "Error: CRM_ENV is not defined"
    exit -1
fi

BUCKET_NAME="crm-files.cyberlark.com.au"
if [ "${CRM_ENV}" != "prod" ]; then
    BUCKET_NAME="crm-${CRM_ENV}-files.cyberlark.com.au"
fi

# remove all objects first
aws s3 rm s3://${BUCKET_NAME} --recursive

# delete bucket
aws s3api delete-bucket --bucket ${BUCKET_NAME} --region ap-southeast-2