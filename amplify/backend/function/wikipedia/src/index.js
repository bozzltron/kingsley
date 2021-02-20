const wiki = require('wikipedia');

exports.handler = async (event) => {
    let response = {};

    if(event.httpMethod == 'OPTIONS'){
        return {
            statusCode: 200,            
            headers: {
                "Access-Control-Allow-Headers" : "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: {}
        }
    }

    try {
        let query = event.queryStringParameters['query'];
        console.log("query", query);
        const summary = await wiki.summary(query.trim());
        console.log(summary);
        if(summary.title && summary.title.includes("Not found")) {
            response = {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Headers" : "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,GET"
                },
                body: JSON.stringify(summary),
            };            
        } else {
            response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Headers" : "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,GET"
                },
                body: JSON.stringify(summary),
            };
        }
    } catch (error) {
        console.log(error);
        response = {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: error
        };
    }

    return response;
};