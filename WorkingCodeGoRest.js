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
    // check for missing request input parameters and headers
    const requiredParams = []
    const requiredHeaders = []
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    // Get method to check if customer already exists in Go Rest.
    const getEndpoint = 'https://gorest.co.in/public/v2/users/'+'?email='+params.data.value.email
    var res = await fetch(getEndpoint,{
    method:"GET",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer fc689ffe2660beb50a34199c3c8aed80236caff6de0e8385391da39f150b96bb'
    },
    })

    if (!res.ok) {
      var response = {
        statusCode: 500,
        body: JSON.stringify(res)
      }
      return response;
    }
    var content = await res.json()

      // //check if content is an empty json response
      if (Object.keys(content).length == 0) {
        const postEndpoint = 'https://gorest.co.in/public/v2/users'
        const body = {
          "name": params.data.value.firstname,
          "gender":params.data.value.gender1, 
          "email":params.data.value.email,
          "status":params.data.value.status
        }
        res = await fetch(postEndpoint,{
          method:"POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fc689ffe2660beb50a34199c3c8aed80236caff6de0e8385391da39f150b96bb'
          },
          body: JSON.stringify(body),
        })
        //Error handling
        if (!res.ok) {
          response = {
            statusCode: 500,
            body: JSON.stringify(res)
          }
          return response;
        }

        content = await res.json()
      }

      // Send data back to magento.
      if(res.ok) {
          const magentoEndPoint = 'https://magento-demo.mageplaza.com/rest/default/V1/customers/7'
          const magentoBody = { 
            "customer": {
                "prefix": params.data.value.id,
                "suffix": content[0].id
          }
        }
        //response from magento 
        res = await fetch(magentoEndPoint,{
          method:"PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJraWQiOiIzIiwiYWxnIjoiSFMyNTYifQ.eyJ1aWQiOjIsInV0eXBpZCI6MiwiaWF0IjoxNjgyNjgwMTg4LCJleHAiOjE2ODI2ODM3ODh9.WWzghRR3O54CGX28MnFignjKMJjHcugmOTYuVlsSxAQ'
          },
          body: JSON.stringify(magentoBody),
        })
        //error handling
        if (!res.ok) {
          response = {
            statusCode: 500
          }
          return response;
        }
        content = await res.json()
      }  


      // //Reqres put method executed.
      // if(res.ok) {
      //     const magentoEndPoint = 'https://reqres.in/api/articles/1'
      //     const magentoBody = { 
      //       "customer": { "MagentoID": params.data.value.id,
      //                      content}
      //   }
      //   //response from magento 
      //   var res = await fetch(magentoEndPoint,{
      //     method:"PUT",
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify(magentoBody),
      //   })
      //   //error handling
      //   if (!res.ok) {
      //     response = {
      //       statusCode: 500,
      //       body: JSON.stringify(res)
      //     }
      //     return response;
      //   }
      //   var content = await res.json()
      // }  

      response = {
        statusCode: 200,
        body: content
      }

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
