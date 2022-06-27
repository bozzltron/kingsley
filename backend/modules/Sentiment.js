const { SentimentAnalyzer } = require("node-nlp");

const Sentiment = {
  analyze: (statement) => {
    const sentiment = new SentimentAnalyzer({ language: "en" });
    return sentiment.getSentiment(statement);
  },
};

module.exports = Sentiment;
