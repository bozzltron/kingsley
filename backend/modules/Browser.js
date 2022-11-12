const puppeteer = require("puppeteer");
const logger = require("./Logger");

function Browser() {
  try {
    return puppeteer.launch({
      headless: process.env.NODE_ENV == "production",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (error) {
    logger.error(error);
  }
}

module.exports = Browser;
