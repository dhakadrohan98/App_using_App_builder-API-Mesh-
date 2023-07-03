const fetch = require('node-fetch');
const { Core } = require('@adobe/aio-sdk');
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils');
const xmlrpc = require('xmlrpc');
const { parseString } = require('xml2js');

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' });
  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action');

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params));

    // check for missing request input parameters and headers
    const requiredParams = [/* add required params */];
    const requiredHeaders = [];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders);
    if (errorMessage) {
      // return and log client errors
      logger.info(' ##### Line 24........');
      return errorResponse(400, errorMessage, logger);
    }

    // extract the user Bearer token from the Authorization header
    const token = getBearerToken(params);

    // replace this with the api you want to access
    const apiEndpoint = 'https://beta-dataconnect.givex.com:50042/';

    // Configure the XML-RPC request options
    const options = {
      host: 'beta-dataconnect.givex.com:50042/',
      headers: {
        'Content-Type': 'text/xml',
      },
    };

    logger.info(' ##### Line 42........');

    // Create an XML-RPC client
    const client = xmlrpc.createClient(options);

    // Define the XML-RPC method name
    const methodName = 'dc_946';

    // Define the method parameters
    const methodParams = [
      { value: { string: 'en' } },
      { value: { string: 'oiuytrewaaq11sdsq2' } },
      { value: { string: '228808' } },
      { value: { string: 'FEFijCf8d6kps22r' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: 'rohan@gmail.com' } },
      { value: { string: '' } },
      { value: { string: 'Rohan' } },
      { value: { string: '' } },
      { value: { string: 'Dhakad' } },
      { value: { string: 'male' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: 'Vijay Nagar' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: 'Indore' } },
      { value: { string: 'India' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: 'rohan111122@gmail.com' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } },
      { value: { string: '' } }
    ];

    logger.info(' ##### Line 105........');
    logger.info(methodParams);
    // Make the XML-RPC request
    const xmlResponse = await new Promise((resolve, reject) => {
      client.methodCall(methodName, methodParams, (error, value) => {
        if (error) {
            logger.info(' ##### Line 109........');
            logger.info(error);
          reject(error);
        } else {
            logger.info(' ##### Line 109........');
            logger.info(value);
          resolve(value);
        }
      });
    });

    // Convert XML response to JSON
    let jsonResponse;
    parseString(xmlResponse, (err, result) => {
      if (err) {
        throw new Error('Error parsing XML response');
      }
      jsonResponse = result;
    });

    const response = {
      statusCode: 200,
      body: jsonResponse,
    };

    logger.info(' ##### Line 134........');
    logger.info(response);

    // log the response status code
    logger.info(`${response.statusCode}: successful request`);
    return response;
  } catch (error) {
    // log any server errors
    logger.info(' ##### Line 142........');
    logger.error(error);
    // return with 500
    return errorResponse(500, 'server error', logger);
  }
}

exports.main = main;
