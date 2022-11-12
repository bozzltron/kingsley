const TextProcessor = {
  detectURLs: (message) => {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.match(urlRegex);
  },
  processGoogleSearchResults: (text) => {
    let results = [];
    text.split("\n").forEach((str) => {
      let urls = TextProcessor.detectURLs(str);
      let item = {
        source: null,
        text: "",
      };
      if (urls && urls.length > 0) {
        if (item.source != null) {
          results.push(item);
          item = {
            source: null,
            text: "",
          };
        }
        item.source = urls[0];
      }
      if (item.source) {
        if (
          str.includes(" are ") ||
          str.includes(" is ") ||
          str.includes(" they ")
        ) {
          item.text += str;
        }
      }
    });
    return results;
  },
};

module.exports = TextProcessor;
