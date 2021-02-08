const wiki = require('wikipedia');
const pos = require('pos');

function filterWordsByTag(text , targetTags) {
    var special = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    var words = new pos.Lexer().lex(text);
    var tagger = new pos.Tagger();
    var taggedWords = tagger.tag(words);
    console.log('taggedWords', taggedWords);
    var nouns = "";
    for(let i=0; i<taggedWords.length; i++){
        var taggedWord = taggedWords[i];
        var word = taggedWord[0];
        var tag = taggedWord[1];
        if(targetTags.includes(tag) && !special.test(word)) {
            nouns = nouns + " " + word;
        }
    }

    console.log('nouns', nouns);
    return nouns;
}

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
        let nouns = filterWordsByTag(query,  ["NN","NNP", "NNPS", "NNS"]);
        console.log("nouns", nouns);
        const summary = await wiki.summary(nouns);
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