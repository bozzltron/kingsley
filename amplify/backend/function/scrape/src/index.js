const fetch = require("node-fetch")
const cheerio = require("cheerio")

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
        let url = event.queryStringParameters['url'];
        console.log("params", event.queryStringParameters);

        const data = await fetch(url).then(res=>res.text());

        const $ = cheerio.load(data)

        // Print some specific page content
        let title = $('h1').text()
        console.log(`First h1 tag: ${title}`);
    
        let img = $('img').text()
        console.log(`First img tag: ${img}`);
    
        let article = $('article').text();
    
        if(!article){
            article = $('p').text();
        }
    
        console.log('article', article);

        response = makeResponse(200, JSON.stringify({
            title: title,
            image: img,
            article: article
        }));

    } catch (error) {
        console.log(error);
        response = makeResponse(500, error);
    }

    console.log('response', response);
    
    return response;
};



