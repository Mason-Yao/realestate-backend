# For JR students

## Get started

1. Setup your own AWS account

   - Create own account
   - Setup your CLI. See [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)

2. Deploy the project into your account.

   - Setup your [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html).
   - Run the script to setup your `CRM_ENV`

   ```
   export CRM_ENV=jr
   ```

   you can change to any other name, which has to match the name under `./configs/*.json`

   - Run the script to create DB.

   ```
    cd Database
    ./createTable.sh
    ./insertInitialData.sh

    cd Property
    ./createPropertyTable.sh
    ./insertPropertyData.sh
   ```

   - Run API deployment

   ```
   cd Backend
   make init     # To run aws deploy for the first time
   make build
   make deploy
   ```

   - Q&A

   Q: "CloudWatch Logs role ARN must be set in account settings to enable logging"
   A: Solution see [this](https://gist.github.com/villasv/4f5b62a772abe2c06525356f80299048)

   Q: Node version?
   A: I use node version: v18.18.0

   - Once it finished, you should get something like:

   ```
   RealEstate-CRM-jr.apiEndpoint9349E63C = https://0cdax62lpb.execute-api.ap-southeast-2.amazonaws.com/prod/
   ```

3. Test your API

   Run your first query via Postman:

   ```
   https://0cdax62lpb.execute-api.ap-southeast-2.amazonaws.com/prod/property/1
   ```

   If you get 200 result back. Congratulations, you are all set up!

4. Fun stuff starts!

## Swagger

Swagger is the docs for communication between frontend and backend. So make it update to date is important.

### Build your swagger

```
make swagger
```

### To view

You can view it on `http://localhost:3000` or
you can copy and paste `swagger.json` file to [Swagger Editor](https://editor.swagger.io/)

## Debug

### Understand CRM_ENV

Read [this](../Docs/Environment.md)

### Lambda code debug

Before you deploying on cloud, you can use [Sample tool](../Tools/sample/) to call your function.

### Cloud debug

After cloud deploy, use cloudwatch for logs. Read [Logging](../Docs/Logging.md)

## Learning Material

Please buy this course: https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/

Please watch required chapters first, and then optionals,
we only touched those services in your project.

Required to know:

- 1-4 Basics-
- 11 S3
- 12 AWS CLI, IAM
- 21 Lambda
- 22 Dynamo
- 23 API Gateway
- 26 CDK
- 20 CloudWatch
- 27 Cognito

Optional if you have time:

- 18 Cloud Formation
- 9 Route53
- 15 CloudFront

## PR rules

0. You don't need to FORK my project, just do your work under this repository.

1. All work need to start in a branch. Under each 'Issue', there is a `Create branch` link to create the branch. Checkout the branch, and add your fix.

2. Commit your changes uner your branch

3. Push your branch

4. Create Pull Request. If you don't want other people to review it, Add `DRAFT` in PR title. Once you are happy your changes. Remove DRAFT, and move on.

5. In PR, please summary what you have fixed, or why you change it in a few sentence. Point to the problem in changes might help reviewers to approve. Also good code comment will also help. For Frontend fix, please attach a screenshot to the review.

6. Ask team member to review. Add at least 2 team remembers in the PR. Change your code, until all members are happy.

7. Assign the PR to me `CyberlarkCode`. I will do a final check, and merge the `main`. This might takes some time to finish.

8. During PR, if the comment has been fix. You can mark this comment as `Resolved`.

9. Once the PR is merged to `main`. Move on, and pick up the next issue.

## Q&A

1. ...

If you have any other questions, please ask me.
If this doc is confusing or not clear, please polish the doc after you have known the answer.

Thanks!
