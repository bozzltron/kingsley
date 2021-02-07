
const WolframAlphaAPI = require('wolfram-alpha-api');

exports.handler = async (event) => {
    let response = {};
    let defaults = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }
    };

    if(event.httpMethod == 'OPTIONS'){
        return Object.assign({}, defaults, {
            statusCode: 200,            
            body: {}
        })
    }

    try {
        let query = event.queryStringParameters['query'];
        const waApi = WolframAlphaAPI(process.env.API_KEY);
        let result = await waApi.getFull(query);
        response = Object.assign({}, defaults, {
            statusCode: 200,
            body: JSON.stringify(result),
        });
    } catch (error) {
        console.log(error);
        response = Object.assign({}, defaults, {
            statusCode: 500,
            body: error
        })
    }

    return response;
};
