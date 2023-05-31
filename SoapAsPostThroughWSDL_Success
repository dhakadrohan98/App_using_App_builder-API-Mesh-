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

const { Core } = require('@adobe/aio-sdk')
const { errorResponse, checkMissingRequestInputs } = require('../utils')
const soap = require('soap')
const util = require('util')

async function main(params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    const requiredParams = []
    const requiredHeaders = []
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      return errorResponse(400, errorMessage, logger)
    }

    const wsdlUrl = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL'

    const createClientAsync = util.promisify(soap.createClient)
    const client = await createClientAsync(wsdlUrl)

    const requestParams = {
      sCountryISOCode: 'USA'
    }

    const result = await client.CapitalCityAsync(requestParams)
    const content = JSON.stringify(result)
    const jsonResponse = {
      statusCode: 200,
      body: content
    }
    return jsonResponse;
  } catch (error) {
    logger.error(error)
    return errorResponse(500, 'server error' + error, logger)
  }
}

exports.main = main
