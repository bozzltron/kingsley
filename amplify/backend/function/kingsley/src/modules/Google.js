const puppeteer = require("puppeteer");

async function search(query) {
  try {
    const URL = "https://www.google.com/";
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(URL);

    await page.type("form input:nth-child(1)", query);

    await Promise.all([
      page.evaluate(() => {
        document.querySelector('input[value="Google Search"]').click();
      }),
      page.waitForNavigation(),
    ]);

    let data = await page.evaluate(() => {
      let results = [];
      let items = document.querySelectorAll("body .g");
      items.forEach((item) => {
        results.push({
          description: item.querySelector("span").textContent,
          url: item.querySelector("a").getAttribute("href"),
          title: item.querySelector("a h3").textContent,
        });
      });
      return results;
    });
    console.log("data", data);
    await browser.close();
    if (items.length == 0) {
      return { text: "I didn't find anything" };
    } else {
      return {
        text: `I found this. ${item[0].description} from article ${item[0].title}`,
        url: item[0].url,
      };
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = search;
