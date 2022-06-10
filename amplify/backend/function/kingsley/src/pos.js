var WordPOS = require("wordpos"),
  wordpos = new WordPOS();

module.exports = {
  getPOS: (text) => {
    return new Promise((resolve, reject) => {
      try {
        wordpos.getPOS(text, resolve);
      } catch (e) {
        reject(e);
      }
    });
  },
};
