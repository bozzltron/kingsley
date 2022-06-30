const puppeteer = require("puppeteer");
const logger = require("./Logger");
async function news(query) {
  query = query.replace("kingsley", "");
  try {
    const URL = "https://apnews.com/";
    const browser = await puppeteer.launch({
      headless: process.env.NODE_ENV == "production",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto(URL);

    let data = await page.evaluate(() => {
      let results = "From the Associated Press: ";
      let items = document.querySelectorAll("h2");
      items.forEach((item, index) => {
        results = results += ` ${index + 1}. ${item.textContent}.`;
      });
      return results;
    });
    logger.info("data", data);
    await browser.close();
    if (data.length == 0) {
      return { text: "I didn't find anything" };
    } else {
      return {
        text: data,
        url: "https://apnews.com",
      };
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = news;
