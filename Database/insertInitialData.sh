#!/bin/bash
if [ "${CRM_ENV}" == "" ]; then
    echo "Error: CRM_ENV is not defined"
    exit -1
fi

CRM_TABLE_NAME="CRM"
if [ "${CRM_ENV}" != "prod" ]; then
    CRM_TABLE_NAME="CRM-${CRM_ENV}"
fi

echo "Adding intial items ..."
# Auth User
aws dynamodb put-item --table-name "${CRM_TABLE_NAME}" --item '{"PK":{"S":"User"},"id":{"S":"1"},"email":{"S":"dave@cyberlark.com.au"},"phone":{"S":"0412173226"}}'
aws dynamodb put-item --table-name "${CRM_TABLE_NAME}" --item '{"PK":{"S":"User"},"id":{"S":"2"},"email":{"S":"ryan@cyberlark.com.au"},"phone":{"S":"0412345678"}}'
aws dynamodb put-item --table-name "${CRM_TABLE_NAME}" --item '{"PK":{"S":"User"},"id":{"S":"3"},"email":{"S":"kevin@cyberlark.com.au"},"phone":{"S":"0412345678"}}'
aws dynamodb put-item --table-name "${CRM_TABLE_NAME}" --item '{"PK":{"S":"User"},"id":{"S":"4"},"email":{"S":"john@cyberlark.com.au"},"phone":{"S":"0412345678"}}'
aws dynamodb put-item --table-name "${CRM_TABLE_NAME}" --item '{"PK":{"S":"User"},"id":{"S":"5"},"email":{"S":"jr@cyberlark.com.au"},"phone":{"S":"0412345678"}}'


# Email Template
aws dynamodb put-item --table-name "${CRM_TABLE_NAME}" --item '{"PK":{"S":"Template"},"id":{"S":"1"},"name":{"S":"TestEmail"},"subject":{"S":"Test Email from Cyberlark.com.au"},"template":{"S":"<p><span class=\"ql-size-large\">Hello {{TO_EMAIL}}</span></p><p><br></p><p>This is<strong> a test email</strong> from {{FROM_EMAIL}}.</p><p><br></p><p><em>Thanks!</em></p><p><br></p><p>David</p><p>{{TODAY_DATE}}</p><p><br></p>"},"createdBy":{"S":"Init"},"createdDate":{"S":"2023-07-10T11:14:18.148Z"},"lastModifiedDate":{"S":"2023-07-10T11:14:18.148Z"}}'
aws dynamodb put-item --table-name "${CRM_TABLE_NAME}" --item '{"PK":{"S":"Template"},"id":{"S":"2"},"name":{"S":"Test2"},"subject":{"S":"Test2 Email"},"template":{"S":"<p></p>"},"createdBy":{"S":"Init"},"createdDate":{"S":"2023-07-10T12:14:18.148Z"},"lastModifiedDate":{"S":"2023-07-10T12:14:18.148Z"}}'

# Settings
aws dynamodb put-item --table-name "${CRM_TABLE_NAME}" --item '{"PK":{"S":"Settings"},"id":{"S":"1"},"name":{"S":"priceUnit"},"value":{"S":"AUD"},"lastModifiedDate":{"S":"2023-07-10T11:14:18.148Z"}}'
aws dynamodb put-item --table-name "${CRM_TABLE_NAME}" --item '{"PK":{"S":"Settings"},"id":{"S":"2"},"name":{"S":"clientsPageSize"},"value":{"S":"20"},"lastModifiedDate":{"S":"2023-07-10T11:14:18.148Z"}}'
aws dynamodb put-item --table-name "${CRM_TABLE_NAME}" --item '{"PK":{"S":"Settings"},"id":{"S":"3"},"name":{"S":"RMBcurrency"},"value":{"S":"4.6"},"lastModifiedDate":{"S":"2023-07-10T11:14:18.148Z"}}'

# Settings - category
list="Gold;#fcdc00 Silver;#999999 Red;#f44e3b Green;#68bc00 Blue;#0062b1 SuperVIP;#fa28ff VIP;#7b64ff"
INDEX=0
for i in $list; do 
    aws dynamodb put-item --table-name "${CRM_TABLE_NAME}" --item "{\"PK\":{\"S\":\"Settings\"},\"id\":{\"S\":\"category_${INDEX}\"},\"name\":{\"S\":\"category_${INDEX}\"},\"value\":{\"S\":\"$i\"},\"lastModifiedDate\":{\"S\":\"2023-07-10T11:14:18.148Z\"}}"
    let INDEX=${INDEX}+1
done

# Well done
echo "Done"