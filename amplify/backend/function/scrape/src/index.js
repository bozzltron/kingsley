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
    

        let img = "";
        let text = "";
        let article = $('article');
        let main = $('main');
    
        if(article) {
            console.log("use article")
            text = article.text();
            img = $('article img').attr('src');
        }   
    
        if(main && !img){
            img = $('main img').attr('src');
        }
        
        if(!text){
            console.log("fallback")
            text = $('p').text();
        }
    
        if(!img) {
            img = $('img').attr('src');
        }
    
        console.log('text', text);

        response = makeResponse(200, JSON.stringify({
            title: title,
            image: img,
            article: text
        }));

    } catch (error) {
        console.log(error);
        response = makeResponse(500, error);
    }

    console.log('response', response);
    
    return response;
};



