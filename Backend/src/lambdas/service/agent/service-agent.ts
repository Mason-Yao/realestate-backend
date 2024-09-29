import { BadRequestError, LambdaEvent, NotImplementedError, Response, UnexpectedError, SetCorsOriginHeader } from "../../common"
import { logger, jsonParser, decode } from "../../../../../Shared/Utils"
import { agent } from "../../../../../Shared/Interface/agent"
import { AdminInitiateAuthCommand, CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider"
import generator from "generate-password-ts"

const cognito = new CognitoIdentityProvider()

export async function handler(event: LambdaEvent) {
  try {
    logger.info("Event: ", event)
    SetCorsOriginHeader(event.headers.origin)

    //Get all users from the user pool
    const listAllUser = await cognito.listUsers({
      UserPoolId: process.env.USER_POOL_ID,
    })

    switch (event.httpMethod) {
      case "POST": {
        /* Add an agent (Admin add agent) */
        logger.info("clientId:" + process.env.USER_POOL_CLIENT_ID)
        logger.info("userPoolId:" + process.env.USER_POOL_ID)

        if (event.resource == "/agent") {
          const body = JSON.parse(event.body)
          const password = generator.generate({
            length: 20,
            numbers: true,
            uppercase: true,
            lowercase: true,
            symbols: true,
          })


          //username input validation
          if (!body.username) {
            return Response(400, { messege: "username is require", emptyUserName: true }) // if username input is empty
          } else if (listAllUser.Users && listAllUser.Users.length > 0) {
            const matchingUser = listAllUser.Users.find((user) => user.Username?.replace(/"/g, "") == body.username)
            if (matchingUser) {
              return Response(201, { messege: "User account already exists at this UserPool", alreadyExit: true }) // if this username already exist in the pool
            }
          }

          const response = await cognito.adminCreateUser({
            UserPoolId: process.env.USER_POOL_ID,
            Username: body.username,
            UserAttributes: [
              {
                Name: "email",
                Value: body.username,
              },
              {
                Name: "email_verified",
                Value: "true",
              },
            ],
            TemporaryPassword: password,
          })

          if (response) {
            logger.info(response)
            return Response(200, { messege: `New Agent added, tempory passWord is ${password}`, agentAdded: true })
          }
        }
        break
      }

      case "OPTIONS": {
        return Response(200)
      }
    }

    return Promise.resolve(new NotImplementedError("Not implemented handler").response())
  } catch (err) {
    logger.error("Error: ", err)
    return Promise.resolve(new UnexpectedError("Something went wrong").response())
  }
}
