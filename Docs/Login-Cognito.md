# Cognito 

## How to set up cognito
1. Setup CRM_ENV

   - Go to ./configs from the root directory
   - Create your own CRM_ENV [Your name].json
   
```json
  {
    "environment": "mark",
    "aws_region": "ap-southeast-2",
    "dynamodb_table_name": "CRM-mark",
    "bucket_name": "crm-mark-files.cyberlark.com.au",
    "cognito_pool_id":"ap-southeast-2_X7nibxiuU" //make sure added this line
  }
```

   - Run the script to setup your `CRM_ENV`

```
  export CRM_ENV=jr
```

2. Run API deployment (Deploy the project to your account)
```
 cd Backend
 make build
 make deploy
```

3. Once it finished, It should be de an link for APIs, something like:

```
 RealEstate-CRM-jr.apiEndpoint9349E63C = https://0cdax62lpb.execute-api.ap-southeast-2.amazonaws.com/prod/
```

4. Test Cognito (admin added user api)
- Run the POST query via Postman
```
  https://qkl7gurlsg.execute-api.ap-southeast-2.amazonaws.com/prod/agent
```

- make sure Run the query with validate username like  **[name]@[email].com**  in the body

```
{
    "username": "agent1234@gmail.com"
}
```



