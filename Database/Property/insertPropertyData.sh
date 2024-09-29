#!/bin/bash
if [ "${CRM_ENV}" == "" ]; then
    echo "Error: CRM_ENV is not defined"
    exit -1
fi

CRM_PROPERTY_TABLE_NAME="CRM-Property"
if [ "${CRM_ENV}" != "prod" ]; then
    CRM_PROPERTY_TABLE_NAME=CRM-${CRM_ENV}-Property
fi

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && (pwd -W 2> /dev/null || pwd))

echo "Adding intial items ..."

PropertiesFiles=("Property01.json" "Property02.json" "Property03.json" "Property04.json")
for file in "${PropertiesFiles[@]}"
do
    aws dynamodb put-item \
        --table-name ${CRM_PROPERTY_TABLE_NAME} \
        --item "file://${SCRIPT_DIR}/InitialData/$file" 
done


# Well done
echo "Properties Data Added"