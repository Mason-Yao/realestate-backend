#!/bin/bash
if [ "${CRM_ENV}" == "" ]; then
    echo "Error: CRM_ENV is not defined"
    exit -1
fi

CRM_PROPERTY_TABLE_NAME="CRM-Property"
if [ "${CRM_ENV}" != "prod" ]; then
    CRM_PROPERTY_TABLE_NAME=CRM-${CRM_ENV}-Property
fi
export CRM_PROPERTY_TABLE_NAME

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && (pwd -W 2> /dev/null || pwd))

TAGS="[{\"Key\": \"Owner\", \"Value\": \"Cyberlark\"}, {\"Key\": \"Project\", \"Value\": \"CRM\"}]"

cat "createPropertyTable.json" | envsubst > table.json

aws dynamodb create-table \
    --cli-input-json file://${SCRIPT_DIR}/table.json \
    --region ap-southeast-2 \
    --tags "${TAGS}" \
    --output json > tmp.json

cat tmp.json

