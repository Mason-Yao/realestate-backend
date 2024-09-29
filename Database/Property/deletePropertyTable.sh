#!/bin/bash
if [ "${CRM_ENV}" == "" ]; then
    echo "Error: CRM_ENV is not defined"
    exit -1
fi

CRM_PROPERTY_TABLE_NAME="CRM-Property"
if [ "${CRM_ENV}" != "prod" ]; then
    CRM_PROPERTY_TABLE_NAME=CRM-${CRM_ENV}-Property
fi

aws dynamodb delete-table --table-name ${CRM_PROPERTY_TABLE_NAME}
