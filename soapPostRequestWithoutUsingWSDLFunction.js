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
const axios = require('axios');
const xml2js = require('xml2js');


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
   // SOAP post method for getting country name through country code
   const wsdlUrl = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL';

   // Prepare SOAP request body
   const requestBody = `<?xml version="1.0" encoding="utf-8"?>
     <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
       <soap:Body>
         <CapitalCity xmlns="http://www.oorsprong.org/websamples.countryinfo">
           <sCountryISOCode>USA</sCountryISOCode>
         </CapitalCity>
       </soap:Body>
     </soap:Envelope>`;

   // Set SOAP headers and make POST request
   const headers = {
     'Content-Type': 'text/xml',
   };
   const response = await axios.post(wsdlUrl, requestBody, { headers });

   // Parse XML response to JSON
   const xml = response.data;
   const parser = new xml2js.Parser();
   const result = await parser.parseStringPromise(xml);

   // Process the SOAP response
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
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
