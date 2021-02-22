const fetch = require("node-fetch")
const cheerio = require("cheerio")

async function go(){
    const data = await fetch(process.env.URL).then(res=>res.text());

    const $ = cheerio.load(data)
    // Print the full HTML
    //console.log(`Site HTML: ${$.html()}\n\n`)

    // Print some specific page content
    let title = $('h1').text()
    console.log(`First h1 tag: ${title}`);

    let img = "";
    let text = "";
    let article = $('article');
    let main = $('main');

    if(article) {
        console.log("use article")
        text = $('article p').text();
        img = $('article img').attr('src');
    } 
    
    // if(main && !text) {
    //     console.log("use main")
    //     text = main.text();
    // }

    if(main && !img){
        img = $('main img').attr('src');
    }
    
    if(!text){
        console.log("fallback")
        text = $('p').text();
    }

    if(!img) {
        img = $('img').attr('src');
    }

    console.log(`First img tag: ${img}`);
    console.log('text', text. trim());

}

go();
