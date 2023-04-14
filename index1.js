/*
* <license header>
*/

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */


const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams = [/* add required params */]
    const requiredHeaders = []
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    // extract the user Bearer token from the Authorization header
    const token = getBearerToken(params)

    // replace this with the api you want to access
    const apiEndpoint = 'https://eventsingress.adobe.io'

    //  const body = {
	//   "datacontenttype": "application/json",
    //     "specversion": "1.0",
    //     "source": "urn:uuid:e68e1a7b-19db-42d0-bd10-27067dea37a1",
    //     "type": "net.sigmainfo",
    //     "id": "1033807",
    //     "data": "your event json payload"
	// }
    // // fetch content from external api endpoint
    // const testResponse = JSON.parse(JSON.stringify(body))
    // const res = await fetch(apiEndpoint,{
    //   method:"POST",
    //   headers: {
    //     'Content-Type': 'application/cloudevents+json',
    //     'x-api-key': '82d09f7ea89c490f91a615850d7f3644',
    //     'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE2ODE0NDYyNDA1OTNfMjE3NWJhZGUtNTYyNC00YjhhLWFjOTctOTBhN2RjOTdlM2ZjX3V3MiIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJhaW8tY2xpLWNvbnNvbGUtYXV0aCIsInVzZXJfaWQiOiJCOUNFMjcwQTY0MTE0RkIxMEE0OTVDQUNAYTYyYzI4NjM2NDEwOTFjNTQ5NWU5YS5lIiwic3RhdGUiOiJ7XCJpZFwiOlwiYTkzNDJiNzFcIixcImNvZGVfdHlwZVwiOlwiYWNjZXNzX3Rva2VuXCIsXCJjbGllbnRfaWRcIjpcImFpby1jbGktY29uc29sZS1hdXRoXCIsXCJwb3J0XCI6XCI0MDY4NVwiLFwiZW52XCI6XCJwcm9kXCJ9IiwiYXMiOiJpbXMtbmExIiwiYWFfaWQiOiIxN0E2MjA2QTYzMzNFQUU3MEE0OTVDNEVAQWRvYmVJRCIsImN0cCI6MCwiZmciOiJYTE9BUEU3VEhQTjdNTjZLRU9RVlpIUUEyVT09PT09PSIsInNpZCI6IjE2ODA2ODAyMjk5MDBfMTVlMDRiZmEtNThiYy00OGEwLWE4ZmUtMGNmYzNmZjJjNDE3X3V3MiIsInJ0aWQiOiIxNjgxNDQ2MjQwNTkzXzI2NGQwMjc0LTc0NmYtNDRmYy05NTk3LThiNzEwYzgxZDEyN191dzIiLCJtb2kiOiI5M2Q0ZWViNSIsInBiYSI6Ik1lZFNlY05vRVYsTG93U2VjIiwicnRlYSI6IjE2ODI2NTU4NDA1OTMiLCJleHBpcmVzX2luIjoiODY0MDAwMDAiLCJzY29wZSI6InVuaWZpZWRfZGV2X3BvcnRhbCxyZWFkX3BjLmRtYV9idWxsc2V5ZSxhZG9iZWlvX2FwaSxvcGVuaWQscmVhZF9jbGllbnRfc2VjcmV0LEFkb2JlSUQscmVhZF9vcmdhbml6YXRpb25zLGFkZGl0aW9uYWxfaW5mby5yb2xlcyxtYW5hZ2VfY2xpZW50X3NlY3JldHMsZ25hdixhZGRpdGlvbmFsX2luZm8ucHJvamVjdGVkUHJvZHVjdENvbnRleHQiLCJjcmVhdGVkX2F0IjoiMTY4MTQ0NjI0MDU5MyJ9.HulBEIbLKMOmYewMzIBbBDyxfXPcur2Er_KU68A3rFu4bJDr4hZ2j4q1Hw3hBl5WxJ9mdnVawVuAbiE4qEYtqsn-71IM7vPXWW2SYeFtH-_u3BZFE0FgKaRX_rejBwLdF89X5Yi9vz6OhJwlHm945JGq3eGLE43Nf_F01DKgww4uQyx-J7fL4lD3JidZyY8S8Cs7xJs51AbZi6HizXrr_BgRGjgx_VJE2ltqfu_5BfM80vRrYRxLEy3HWFeFS-3W2BwQIdOXAS5W-4UsGXYp6G9MvWYpKn2DxYNR6IUC7wIZAvayBgKPJ9m4xl7514huY_7JpATh7yU6NWoA41YNwQ'
    //   },
    //   body: testResponse,
    // })
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "82d09f7ea89c490f91a615850d7f3644");
    myHeaders.append("Content-Type", "application/cloudevents+json");
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE2ODE0NDYyNDA1OTNfMjE3NWJhZGUtNTYyNC00YjhhLWFjOTctOTBhN2RjOTdlM2ZjX3V3MiIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJhaW8tY2xpLWNvbnNvbGUtYXV0aCIsInVzZXJfaWQiOiJCOUNFMjcwQTY0MTE0RkIxMEE0OTVDQUNAYTYyYzI4NjM2NDEwOTFjNTQ5NWU5YS5lIiwic3RhdGUiOiJ7XCJpZFwiOlwiYTkzNDJiNzFcIixcImNvZGVfdHlwZVwiOlwiYWNjZXNzX3Rva2VuXCIsXCJjbGllbnRfaWRcIjpcImFpby1jbGktY29uc29sZS1hdXRoXCIsXCJwb3J0XCI6XCI0MDY4NVwiLFwiZW52XCI6XCJwcm9kXCJ9IiwiYXMiOiJpbXMtbmExIiwiYWFfaWQiOiIxN0E2MjA2QTYzMzNFQUU3MEE0OTVDNEVAQWRvYmVJRCIsImN0cCI6MCwiZmciOiJYTE9BUEU3VEhQTjdNTjZLRU9RVlpIUUEyVT09PT09PSIsInNpZCI6IjE2ODA2ODAyMjk5MDBfMTVlMDRiZmEtNThiYy00OGEwLWE4ZmUtMGNmYzNmZjJjNDE3X3V3MiIsInJ0aWQiOiIxNjgxNDQ2MjQwNTkzXzI2NGQwMjc0LTc0NmYtNDRmYy05NTk3LThiNzEwYzgxZDEyN191dzIiLCJtb2kiOiI5M2Q0ZWViNSIsInBiYSI6Ik1lZFNlY05vRVYsTG93U2VjIiwicnRlYSI6IjE2ODI2NTU4NDA1OTMiLCJleHBpcmVzX2luIjoiODY0MDAwMDAiLCJzY29wZSI6InVuaWZpZWRfZGV2X3BvcnRhbCxyZWFkX3BjLmRtYV9idWxsc2V5ZSxhZG9iZWlvX2FwaSxvcGVuaWQscmVhZF9jbGllbnRfc2VjcmV0LEFkb2JlSUQscmVhZF9vcmdhbml6YXRpb25zLGFkZGl0aW9uYWxfaW5mby5yb2xlcyxtYW5hZ2VfY2xpZW50X3NlY3JldHMsZ25hdixhZGRpdGlvbmFsX2luZm8ucHJvamVjdGVkUHJvZHVjdENvbnRleHQiLCJjcmVhdGVkX2F0IjoiMTY4MTQ0NjI0MDU5MyJ9.HulBEIbLKMOmYewMzIBbBDyxfXPcur2Er_KU68A3rFu4bJDr4hZ2j4q1Hw3hBl5WxJ9mdnVawVuAbiE4qEYtqsn-71IM7vPXWW2SYeFtH-_u3BZFE0FgKaRX_rejBwLdF89X5Yi9vz6OhJwlHm945JGq3eGLE43Nf_F01DKgww4uQyx-J7fL4lD3JidZyY8S8Cs7xJs51AbZi6HizXrr_BgRGjgx_VJE2ltqfu_5BfM80vRrYRxLEy3HWFeFS-3W2BwQIdOXAS5W-4UsGXYp6G9MvWYpKn2DxYNR6IUC7wIZAvayBgKPJ9m4xl7514huY_7JpATh7yU6NWoA41YNwQ");

    var raw = JSON.stringify({
    "datacontenttype": "application/json",
    "specversion": "1.0",
    "source": "urn:uuid:e68e1a7b-19db-42d0-bd10-27067dea37a1",
    "type": "net.sigmainfo",
    "id": "1033807",
    "data": "your event json payload"
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    const res = await fetch("https://eventsingress.adobe.io", requestOptions);

    if (!res.ok) {
      throw new Error('request to ' + apiEndpoint + ' failed with status code ' + res.status+"param"+JSON.stringify(res))
    }
    throw new Error('request to ' + apiEndpoint + ' failed with status code ' + res.status+"param"+JSON.stringify(res))
    const content = await res.json()
    const response = {
      statusCode: 200,
      body: content
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error'+error, logger)
  }
}

exports.main = main
