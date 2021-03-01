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
                prompt: `Text: hello\nCategory: Internal\n###\nText: how are you\nCategory: Internal\n###\nText: what is your name\nCategory: Internal\n###\nText: how are you feeling\nCategory: Internal\n###\nText: what is the time\nCategory: External\n###\nText: when does season three come out\nCategory: External###\nText: what's 2 + 2\nCategory: Computation\n###Text: are you human\nCategory: Internal\n###\nText: what is the forecast \nCategory:   External\n###\nText: do you have a name\nCategory: Internal\n###\nText: what is 18 / 7\nCategory: Computation\n###\nText: how far to Iowa\nCategory: Computation\n###\nText: what is the distance to denver\nCategory: Computation\n###\nText: what is the 40 percent of 100\nCategory: Computation\n###\nText: ${prompt} \nCategory:`,
                maxTokens: 64,
                temperature: 0,
                topP: 1,
                presencePenalty: 0,
                frequencyPenalty: 0,
                stop: ["\n"]
            });
        } else if (type == 'question') {
            body = await openai.complete({
                engine: 'davinci',
                prompt: `I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with \"Unknown\".\n\nQ: What is human life expectancy in the United States?\nA: Human life expectancy in the United States is 78 years.\n\nQ: Who was president of the United States in 1955?\nA: Dwight D. Eisenhower was president of the United States in 1955.\n\nQ: Which party did he belong to?\nA: He belonged to the Republican Party.\n\nQ: What is the square root of banana?\nA: Unknown\n\nQ: How does a telescope work?\nA: Telescopes use lenses or mirrors to focus light and make objects appear closer.\n\nQ: Where were the 1992 Olympics held?\nA: The 1992 Olympics were held in Barcelona, Spain.\n\nQ: How many squigs are in a bonk?\nA: Unknown\n\nQ:`,
                maxTokens: 100,
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