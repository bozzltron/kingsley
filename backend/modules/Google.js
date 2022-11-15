const Browser = require("./Browser");
const logger = require("./Logger");
async function search(query) {
  query = query.replace("kingsley", "");
  let indexOfFor = query.indexOf("for");
  query = query.substring(indexOfFor + 3);
  try {
    const URL = "https://www.google.com/";
    const browser = await Browser();
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
        let img = item.querySelector("img");
        results.push({
          description: item.querySelector("span").textContent,
          url: item.querySelector("a").getAttribute("href"),
          title: item.querySelector("a h3").textContent,
          image: img ? img.src : null,
        });
      });

      items = document.querySelectorAll("body .yuRUbf");
      items.forEach((item) => {
        let img = item.querySelector("img");
        results.push({
          description: item.querySelector("span").textContent,
          url: item.querySelector("a").getAttribute("href"),
          title: item.querySelector("a h3").textContent,
          image: img ? img.src : null,
        });
      });
      //var theText = document.body.innerText;
      return results;
    });
    logger.info("data", data);
    //await browser.close();
    if (data.length == 0) {
      return { text: "I didn't find anything" };
    } else {
      return {
        text: `I found this. ${data[0].description} from article ${data[0].title}`,
        url: data[0].url,
      };
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = search;
