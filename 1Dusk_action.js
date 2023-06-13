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

  // Get method to check if customer already exists in Go Rest.
    const getEndpoint = 'https://gorest.co.in/public/v2/users/'+'?email='+params.data.value.email
    var res = await fetch(getEndpoint,{
      method:"GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer fc689ffe2660beb50a34199c3c8aed80236caff6de0e8385391da39f150b96bb'
      },
    })

    // Error handling while Gorest website is down
    if (!res.ok) {
      var response = {
        statusCode: 500,
        body: res
      }
      return response;
    }
    var content = await res.json()

    //Posting data to another action(gorest) for creating account on Gorest & send gorest_id to another AC(mageplaza) 
    //instance through that action(gorest)
    if(content.id == undefined) {
    const anotherEndPoint = 'https://eventsingress.adobe.io'
    const anotherBody = {
      "datacontenttype": "application/json",
      "specversion": "1.0",
      "source": "urn:uuid:7d29b29f-da67-46c9-998b-b53a7aaef07e",
      "type": "com.gorest.eventcode",
      "id": "7d29b29f-da67-46c9-998b-b53a7aaef07e",
      "data":"",
      "name": params.data.value.firstname,
      "gender":params.data.value.gender1,
      "email":params.data.value.email,
      "status":params.data.value.status,
      "magento_id":params.data.value.id
  }

  res = await fetch(anotherEndPoint,{
    method:"POST",
    headers: {
      'Content-Type': 'application/cloudevents+json',
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE2ODMxNzQ0OTI2NjRfYmI2N2ZjNDUtMjBkNS00ZmJkLThkODctYmJjOTBkMzY2YzUwX3V3MiIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJhaW8tY2xpLWNvbnNvbGUtYXV0aCIsInVzZXJfaWQiOiJCOUNFMjcwQTY0MTE0RkIxMEE0OTVDQUNAYTYyYzI4NjM2NDEwOTFjNTQ5NWU5YS5lIiwic3RhdGUiOiJ7XCJpZFwiOlwiMmM5M2RmOWRcIixcImNvZGVfdHlwZVwiOlwiYWNjZXNzX3Rva2VuXCIsXCJjbGllbnRfaWRcIjpcImFpby1jbGktY29uc29sZS1hdXRoXCIsXCJwb3J0XCI6XCI0NDE4OVwiLFwiZW52XCI6XCJwcm9kXCJ9IiwiYXMiOiJpbXMtbmExIiwiYWFfaWQiOiIxN0E2MjA2QTYzMzNFQUU3MEE0OTVDNEVAQWRvYmVJRCIsImN0cCI6MCwiZmciOiJYTkdJWkU3VEhQUDdNTjZLRU9RVlpIUUFHWT09PT09PSIsInNpZCI6IjE2ODA2ODAyMjk5MDBfMTVlMDRiZmEtNThiYy00OGEwLWE4ZmUtMGNmYzNmZjJjNDE3X3V3MiIsInJ0aWQiOiIxNjgzMTc0NDkyNjY0XzI2YjYzMzA0LWI2NDMtNDM3MC1iNGZlLWNjN2Y0M2YzM2UyMl91dzIiLCJtb2kiOiJiZjllZTA2ZiIsInBiYSI6Ik1lZFNlY05vRVYsTG93U2VjIiwicnRlYSI6IjE2ODQzODQwOTI2NjQiLCJleHBpcmVzX2luIjoiODY0MDAwMDAiLCJjcmVhdGVkX2F0IjoiMTY4MzE3NDQ5MjY2NCIsInNjb3BlIjoidW5pZmllZF9kZXZfcG9ydGFsLHJlYWRfcGMuZG1hX2J1bGxzZXllLGFkb2JlaW9fYXBpLG9wZW5pZCxyZWFkX2NsaWVudF9zZWNyZXQsQWRvYmVJRCxyZWFkX29yZ2FuaXphdGlvbnMsYWRkaXRpb25hbF9pbmZvLnJvbGVzLG1hbmFnZV9jbGllbnRfc2VjcmV0cyxnbmF2LGFkZGl0aW9uYWxfaW5mby5wcm9qZWN0ZWRQcm9kdWN0Q29udGV4dCJ9.NBO686HVVlqaeDtwEqSNB1bgx9zVYlau7AXTo3hCdZNhsbsVEVoCBknyDAVh0Cgn8HbybH7c-yDZx5V5T7j0s0N7D1qC37uY3eCXExH8OGEgmrqFYDmt35daVTB4aQQzdqyEc-_K5mi57RuYAgkvec5340Xdty6oabpPui3BW21W7VA7EXLW4Os3t5Z7wrd-nOuH5vL6KAV31Pbf9vMQG5bLD090zDMu89QB4QtZCSPfHo6GIGzVoKFOo2AT5qB3EWOYKlxWLmb8mfTElCzhC5IOx9hm23QIlcyd9DoLSPnaqwtSfB6EIDyD_-ST8NS6lXOJixNwQoDdTLGTkxmWTg',
      'x-api-key': '3417d9295eff4989b7fc3c04e1099d8e'
    },
    body: JSON.stringify(anotherBody),
  })

  //Error handling
  if (!res.ok) {
    response = {
      statusCode: 500,
      body: res
    }
    return response;
  }
  
  content = await res.json()
}
else {
    // Send data back to magento.
    // if(res.ok) {
    const magentoEndPoint = 'https://magento-demo.mageplaza.com/rest/default/V1/customers/3'

    var magentoBody = {
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
        'Authorization': 'Bearer eyJraWQiOiI0IiwiYWxnIjoiSFMyNTYifQ.eyJ1aWQiOjIsInV0eXBpZCI6MiwiaWF0IjoxNjgzMTc0MDg2LCJleHAiOjE2ODMxNzc2ODZ9.hzNpefBHAQ3ntxzYxs9Ge7VhFwkeEm_pyp0v6L87_D8'
      },
      body: JSON.stringify(magentoBody),
    })
    //Error handling
    if (!res.ok) {
      response = {
        statusCode: 500,
        body: res
      }
      return response;
    }
    content = await res.json()
}

  var response = {
      statusCode: 200,
      body: content
    }

    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
