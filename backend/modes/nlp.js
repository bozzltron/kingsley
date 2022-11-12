const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: "org-oRMrXQorTUgrPoKkQZDQSw7x",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function nlp(req, res, metadata, statement) {
  console.log("nlp");
  let response = {};

  try {
    let body;

    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, a fan of Wes Anderson, and very friendly.\n\nHuman: Hello \nAI: Hi! How are you?\nHuman: ${statement}\nAI:`,
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0,
    });

    console.log(completion.data);

    response = { text: completion.data.choices[0].text };
  } catch (error) {
    console.log(error);
    response = makeResponse(500, error);
  }

  return response;
}

module.exports = nlp;
