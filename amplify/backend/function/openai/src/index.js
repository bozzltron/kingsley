const OpenAI = require('openai-api');
const openai = new OpenAI(process.env.API_KEY);

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
        let prompt = event.queryStringParameters['prompt'];
        let type = event.queryStringParameters['type'] || 'chat';
        let body;
        console.log("params", event.queryStringParameters);


        if(type === 'chat') {
            body = await openai.complete({
                engine: 'davinci',
                prompt: `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.${prompt}`,
                maxTokens: 300,
                temperature: 0.9,
                topP: 1,
                presencePenalty: 0.6,
                frequencyPenalty: 0,
                stop: ["\n", " Human:", " AI:"]
            });
        } else if(type == 'keywords') {
            body = await openai.complete({
                engine: 'davinci',
                prompt: `Text: ${prompt} \nKeywords:`,
                maxTokens: 60,
                temperature: 0.3,
                topP: 1,
                presencePenalty: 0,
                frequencyPenalty: 0.8,
                stop: ["\n"]
            });
        } else if(type == 'classify') {
            body = await openai.complete({
                engine: 'davinci',
                prompt: `Text: how are you\nCategory: Internal\n###\nText: what is your name\nCategory: Internal\n###\nText: how are you feeling\nCategory: Internal\n###\nText: what is the time\nCategory: External\n###\nText: when does season three come out\nCategory: External\n###\nText: what's 2 + 2\nCategory: External\n###\nText: are you human\nCategory: Internal\n###\nText: what is the forecast \nCategory:   External\n###\nText: do you have a name\nCategory: Internal\n###\nText: ${prompt} \nCategory:`,
                maxTokens: 64,
                temperature: 0,
                topP: 1,
                presencePenalty: 0,
                frequencyPenalty: 0,
                stop: ["\n"]
            });
        }

        response = makeResponse(200, JSON.stringify(body.data));

    } catch (error) {
        console.log(error);
        response = makeResponse(500, error);
    }

    return response;
};