const fetch = require('node-fetch');
const { Core } = require('@adobe/aio-sdk');
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils');
const xmlrpc = require('xmlrpc');
const xml2js = require('xml2js');

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
        const requiredParams = [];
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
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

        const host = 'dev-dataconnect.givex.com:50042';
        const port = 50042;
        const methodName = 'dc_946';

        const client = xmlrpc.createSecureClient({ host});

    const payload = {
        languageCode: 'en',
        transactionCode: 'qwertyssddffffuish',
        userID: 228808,
        password: 'FEFijCf8d6kps22r',
        customerLogin: 'praveen@gmail.com',
        customerFirstName: 'Praveen',
        customerLastName: 'Verma',
        customerAddress: 'Krishna Business park Vijay Nagar',
        customerAddress2: 'Krishna Business park Vijay Nagar Address line 2',
        customerCity: 'Indore',
        customerCounty: 'India',
        customerPostalCode: '452010',
        };

        // Add optional parameters if needed
        payload.givexNumber = ''
        payload.customerType = ''
        payload.customerTitle = ''
        payload.customerMiddleName = ''
        payload.customerGender = ''
        payload.customerBirthdate = ''
        payload.customerProvince = ''
        payload.customerCountry = ''
        payload.customerPhone = ''
        payload.customerEmail = ''
        payload.customerPassword = ''
        payload.customerMobile = ''
        payload.customerCompany = ''
        payload.securityCode = ''
        payload.newCardRequest = ''
        payload.promotionOptInMail = ''
        payload.memberType = ''
        payload.customerLangPref = ''
        payload.messageType = ''
        payload.messageDeliveryMethod = ''
        payload.companyABN = ''
        payload.position = ''
        payload.companyIndustry = ''
        payload.manualApproval = ''
        payload.holdForEnrPayment = ''
        payload.returnToken = ''
        payload.customerWaitingActivation = ''
        payload.customerSocialLoginList = ''
        payload.cardDescription = ''
        payload.governmentID = ''
        payload.redemptionOptIn = ''
        payload.promotionOptInPhone = ''
        payload.newSecurityCode = ''
        payload.customerAlternativeName = ''
        payload.customerNationality = ''
        payload.generateOTPKey = ''
        payload.CWSSkin = ''
        payload.customFields = ''
        payload.returnURLEmailValidation = ''

        logger.info(payload)
    client.methodCall(methodName, [payload], (error, value) => {
    if (error) {
        logger.info('Line: 99 | Error:', error);
    } else {
        logger.info('Line: 101 | Response:', value);
    }
    });

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(value);
    const content = JSON.stringify(result);

    const jsonResponse = {
        statusCode: 200,
        body: content
    };

    return jsonResponse;
}
    catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    // return 200;
    return errorResponse(500, 'server error'+error, logger)
  }
}

exports.main = main;
