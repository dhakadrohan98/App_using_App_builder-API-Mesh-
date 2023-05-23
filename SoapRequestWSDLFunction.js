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
const soap = require('soap');

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
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

    // SOAP GET method for Number Conversion.
    const wsdlUrl = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL';

    return new Promise((resolve, reject) => {
      soap.createClient(wsdlUrl, (err, client) => {
        if (err) {
          logger.error(err);
          return reject(errorResponse(500, 'Error creating SOAP client', logger));
        }

        // Call a specific SOAP function
        client.ListOfContinentsByName({}, (err, result) => {
          if (err) {
            logger.error(err);
            return reject(errorResponse(500, 'Error calling SOAP function', logger));
          }

          // Process the SOAP response
          resolve(result);
        });
      });
    }).then((result) => {
      const content = JSON.stringify(result);
      const jsonResponse = {
        statusCode: 200,
        body: content
      };
      return jsonResponse;
    });

  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    // return 200;
    return errorResponse(500, 'server error' + error, logger)
  }
}

exports.main = main
