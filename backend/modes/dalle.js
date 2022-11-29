const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: "org-oRMrXQorTUgrPoKkQZDQSw7x",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function dalle(statement, metadata) {
  console.log("dalle");
  let response = {};

  try {
    const body = await openai.createImage({
      prompt: statement,
      n: 1,
      size: "1024x1024",
    });

    console.log(body.data);

    response = { image: body.data.data[0].url, text: "here you go" };
  } catch (error) {
    console.log(error);
    response = makeResponse(500, error);
  }

  return response;
}

module.exports = dalle;
