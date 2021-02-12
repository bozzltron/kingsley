var unirest = require("unirest");
exports.handler = async (event) => {

    let response = {};

    if (event.httpMethod == 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: {}
        }
    }

    try {
        let query = event.queryStringParameters['query'];
        let pageNumer = event.queryStringParameters['pageNumber'] || "1";
        let pageSize = event.queryStringParameters['pageSize'] || "10";
        let fromPublishedDate = event.queryStringParameters['fromPublishedDate'] || "null";
        let toPublishedDate = event.queryStringParameters['toPublishedDate'] || "null";

        console.log("params", event.queryStringParameters);

        let res = await unirest
            .get('https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI')
            .headers({
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
                "useQueryString": true
            })
            .query({
                "q": query,
                "pageNumber": pageNumer,
                "pageSize": pageSize,
                "autoCorrect": "true",
                "fromPublishedDate": fromPublishedDate,
                "toPublishedDate": toPublishedDate
            })
            .send()

            console.log('res.body', res.body);
            response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,GET"
                },
                body: JSON.stringify(res.body)
            }

    } catch (error) {
        console.log(error);
        response = {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: error
        }
    }

    return response;
};