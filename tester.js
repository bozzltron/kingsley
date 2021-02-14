const OpenAI = require('openai-api');
const openai = new OpenAI(process.env.API_KEY);

async function test() {

let response = {};


try {

    const body = await openai.complete({
        engine: 'davinci',
        prompt: "Human: What's the weather like in Waukee, Iowa? \n AI:",
        maxTokens: 300,
        temperature: 0.9,
        topP: 1,
        presencePenalty: 0.6,
        frequencyPenalty: 0,
        stop: ["\n", " Human:", " AI:"]
    });

    console.log(JSON.stringify(body.data, 2, 2));

} catch (error) {
    console.log(error);
}

}

test();