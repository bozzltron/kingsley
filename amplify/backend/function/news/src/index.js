const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.API_KEY);

function makeResponse(code, body) {
    return {
        statusCode: code,
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
        body: body
    }
}
exports.handler = async (event) => {

    let response = {};

    if (event.httpMethod == 'OPTIONS') {
        return makeResponse(200, {})
    }

    try {
        let query = event.queryStringParameters['query'];
        let category = event.queryStringParameters['category'];
        let sources = event.queryStringParameters['sources'];
        let country = event.queryStringParameters['country'];

        console.log("params", event.queryStringParameters);

        let body = await newsapi.v2.topHeadlines({
            sources: sources,
            q: query,
            category: category,
            language: 'en',
            country: country || 'us'
        });

        response = makeResponse(200, JSON.stringify(body));

    } catch (error) {
        console.log(error);
        response = makeResponse(500, error);
    }

    return response;
};