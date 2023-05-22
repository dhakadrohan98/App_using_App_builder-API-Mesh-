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
// const axios = require('axios');
const xml2js = require('xml2js');



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

  // SOAP POST method for Number Conversion.
  const url = 'https://number-conversion-service.p.rapidapi.com/webservicesserver/NumberConversion.wso';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/xml',
      'X-RapidAPI-Key': '2797b00864mshad68a0bf709ee39p1d762ejsn2d714d4a97a2',
      'X-RapidAPI-Host': 'number-conversion-service.p.rapidapi.com'
    },
    body: '<?xml version=\'1.0\' encoding=\'utf-8\'?><soap:Envelope xmlns:soap=\'http://schemas.xmlsoap.org/soap/envelope/\'><soap:Body><NumberToWords xmlns=\'http://www.dataaccess.com/webservicesserver/\'><ubiNum>6699</ubiNum></NumberToWords></soap:Body></soap:Envelope>'
  };

const response = await fetch(url, options);
const xml = await response.text();

const parser = new xml2js.Parser();
const result = await parser.parseStringPromise(xml);
const content = JSON.stringify(result);

const jsonResponse = {
  statusCode: 200,
  body: content
};

return jsonResponse;


  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    // return 200;
    return errorResponse(500, 'server error'+error, logger)
  }
}

exports.main = main
