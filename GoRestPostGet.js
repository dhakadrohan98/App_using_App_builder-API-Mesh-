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

    // return {
    //   statusCode: 200
    // }

    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams = []
    const requiredHeaders = []
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    // replace this with the api you want to access
    const apiEndpoint = 'https://gorest.co.in/public/v2/users'

    // const eventDetail = params.event['activitystreams:object']

    const body = {
      "name": params.data.value.firstname,
      "gender":params.data.value.gender1, 
      "email":params.data.value.email,
      "status":params.data.value.status
    }

    // fetch content from external api endpoint
    var res = await fetch(apiEndpoint,{
      method:"POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fc689ffe2660beb50a34199c3c8aed80236caff6de0e8385391da39f150b96bb'
      },
      body: JSON.stringify(body),
    })


    //if res.status is 422 it means account already exits in gorest, we need to get GoRest id only in this case. 
    if(res.status==422) {
      const getEndpoint = 'https://gorest.co.in/public/v2/users'

      const bodyGoRest = {
        "email":params.data.value.email
      }

        // fetch content from external api endpoint
      res = await fetch(getEndpoint,{
      method:"GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer fc689ffe2660beb50a34199c3c8aed80236caff6de0e8385391da39f150b96bb'
      },
      })

    }

    if (!res.ok) {
      throw new Error('request to ' + apiEndpoint + ' failed with status code ' + res.status+" param"+JSON.stringify(res))
    }

    const content = await res.json()

  //   const magentoEndPoint = 'http://adobecommerce.com/rest/default/V1/customers/'+params.data.value.id

  //   const magentoBody = { 
  //     "customer": {
  //         "custom_attributes": [
  //          {
  //         "attribute_code": "gorest_id",
  //         "value": content.id
  //         }
  //     ]
  //   }
  // }

  // // fetch content from external api endpoint
  // const magentoRes = await fetch(magentoEndPoint,{
  //   method:"PUT",
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer eyJraWQiOiIxIiwiYWxnIjoiSFMyNTYifQ.eyJ1aWQiOjEsInV0eXBpZCI6MiwiaWF0IjoxNjgyNTE5ODk0LCJleHAiOjE2ODI1MjM0OTR9.tf-eBbJso4kr7VUlk8w-4wCRYp505OsRNzNvdkkPiVM'
  //   },
  //   body: JSON.stringify(magentoBody),
  // })

    const response = {
      statusCode: 200,
      body: content
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    // return 200;
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    // return 200;
    return errorResponse(500, 'server error'+error, logger)
  }
}

exports.main = main
