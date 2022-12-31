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
      model: "text-davinci-003",
      prompt: `The following is a conversation with an AI assistant. This assistants name is Kingsley. The assistant is helpful, creative, clever, a fan of Wes Anderson, and very friendly.\n\nHuman: Hello \nAI: Hi! How are you?\nHuman: ${statement}\nAI:`,
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0,
    });

    let text = completion.data.choices[0].text;

    const urlRegex = /(https?:\/\/[^ ]*)/;
    const url = text.match(urlRegex)[1];

    console.log(completion.data);
    response = { text: text };
    if (
      url &&
      (url.includes(".jpg") ||
        url.includes(".png") ||
        url.includes(".gif") ||
        url.includes(".webp"))
    ) {
      response.image = url;
    } else {
      response.url = url;
    }
  } catch (error) {
    console.log(error);
    response = { text: "I encountered an error. Try again." };
  }

  return response;
}

module.exports = nlp;
