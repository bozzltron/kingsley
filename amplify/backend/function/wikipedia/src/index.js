const wiki = require('wikipedia');

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
        });
    }

    try {
        const page = await wiki.page(event.queryStringParameters['query']);
        const summary = await page.summary();
        console.log(summary);
        response = Object.assign({}, defaults, {
            statusCode: 200,
            body: JSON.stringify(summary),
        });
    } catch (error) {
        console.log(error);
        response = Object.assign({}, defaults, {
            statusCode: 500,
            body: error
        });
    }

    return response;
};