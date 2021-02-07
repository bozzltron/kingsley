
const WolframAlphaAPI = require('wolfram-alpha-api');

exports.handler = async (event) => {
    let response = {};

    if(event.httpMethod == 'OPTIONS'){
        return {
            statusCode: 200,            
            body: {}
        }
    }

    try {
        let query = event.queryStringParameters['query'];
        const waApi = WolframAlphaAPI(process.env.API_KEY);
        let result = await waApi.getFull(query);
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": true
            },
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.log(error);
        response = {
            statusCode: 500,
            body: error
        }
    }

    return response;
};
