const soap = require('soap')

function SearchInFutura(apiEndpoint, header, payload) {
    console.log('Creating SOAP client...');
    return new Promise((resolve, reject)=> {
        soap.createClient(apiEndpoint, {wsdl_headers:header}, function(err, client) {
            if(err) {
                console.error('Error creating SOAP client:', err);
                reject(err)
            }
            console.log('SOAP client created successfully');
            console.log('web_search function is going to be called');
            client.web_search_customer(payload, function(err, result) {
                console.log(' <<<<<<<<< Line 14 >>>>>>>>>>');
                 if(err){
                    console.log('Customer Error');
                    console.log("actual error: ",JSON.stringify(err, null, 2));
                    console.error('Error calling web_search_customer:', err.message);
                    reject(err)
                 }
                 else {
                    console.log('web_search_customer successful');
                    resolve(result)
                    console.log(result)
                 }   
            })        
        })
    })
}

module.exports = {
    SearchInFutura
}
