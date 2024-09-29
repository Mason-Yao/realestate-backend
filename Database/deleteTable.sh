#!/bin/bash
if [ "${CRM_ENV}" == "" ]; then
    echo "Error: CRM_ENV is not defined"
    exit -1
fi

CRM_TABLE_NAME="CRM"
if [ "${CRM_ENV}" != "prod" ]; then
    CRM_TABLE_NAME="CRM-${CRM_ENV}"
fi

aws dynamodb delete-table --table-name ${CRM_TABLE_NAME}
