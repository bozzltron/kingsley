const { SentimentAnalyzer } = require("node-nlp");
const sentiment = new SentimentAnalyzer({ language: "en" });

const Sentiment = {
  analyze: (statement) => {
    return sentiment.getSentiment(statement);
  },
};

module.exports = Sentiment;
