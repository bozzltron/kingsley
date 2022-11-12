const { a } = require("aws-amplify");
const Browser = require("./Browser");
const logger = require("./Logger");

function detectURLs(message) {
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return message.match(urlRegex);
}

async function define(query) {
  query = query.replace("kingsley", "");
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
      document.body.innerText.split("\n").forEach((str) => {
        let urls = detectURLs(str);
        let item = {
          source: null,
          text: "",
        };
        if (urls.length > 0) {
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
    });
    logger.info("data", data);
    await browser.close();
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

module.exports = define;
