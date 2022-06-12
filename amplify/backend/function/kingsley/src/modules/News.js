const puppeteer = require("puppeteer");

async function news(query) {
  query = query.replace("kingsley", "");
  try {
    const URL = "https://apnews.com/";
    const browser = await puppeteer.launch({ headless: false });
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
    console.log("data", data);
    //await browser.close();
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
