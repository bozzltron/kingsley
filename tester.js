const fetch = require("node-fetch")
const cheerio = require("cheerio")

async function go(){
    const data = await fetch("https://apnews.com/article/us-news-shootings-new-orleans-metairie-louisiana-d2688cf8a0471ba3a035547b89e4645b").then(res=>res.text());

    const $ = cheerio.load(data)
    // Print the full HTML
    //console.log(`Site HTML: ${$.html()}\n\n`)

    // Print some specific page content
    let title = $('h1').text()
    console.log(`First h1 tag: ${title}`);

    let img = $('img').text()
    console.log(`First img tag: ${img}`);

    let article = $('article').text();

    if(!article){
        article = $('p').text();
    }

    console.log('article', article);

}

go();
