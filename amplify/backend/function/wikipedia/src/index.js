const wiki = require('wikipedia');

exports.handler = async (event) => {
    let response = {};

    if(event.httpMethod == 'OPTIONS'){
        return {
            statusCode: 200,
            body: {}
        }
    }

    try {
        const page = await wiki.page(event.queryStringParameters['query']);
        const summary = await page.summary();
        console.log(summary);
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": true
            },
            body: JSON.stringify(summary),
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