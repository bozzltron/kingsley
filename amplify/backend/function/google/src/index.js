var unirest = require("unirest");

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
        console.log("params", event.queryStringParameters);

        let promise = new Promise((resolve, reject)=>{
            var req = unirest("GET", `https://google-search3.p.rapidapi.com/api/v1/search/q=${query}&num=5`);

            req.headers({
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": "google-search3.p.rapidapi.com",
                "useQueryString": true
            });
            
            req.end(function (res) {
                if (res.error) reject(res.error);
                console.log('body', res.body);
                resolve(makeResponse(200, JSON.stringify(res.body)));
            });
        })

        response = await promise;

    } catch (error) {
        console.log(error);
        response = makeResponse(500, error);
    }

    console.log('response', response);y
    
    return response;
};



