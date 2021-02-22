import Amplify, { API } from 'aws-amplify';
import awsconfig from './aws-exports';
import session from './session';
import { Response, Article, Link } from './interfaces'
import face from './face'

Amplify.configure(awsconfig);

function getRandomItemFrom(array :Array<string>) {
    return array[Math.floor(Math.random() * array.length)];
}

const commands = {

    getTheTime: ()=>{
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        var d = new Date();
        var date = new Date();
        var hours = date.getHours();
        var minutes :number = date.getMinutes();
        var day = date.getUTCDate();
        var year = date.getUTCFullYear();
        var month = monthNames[date.getUTCMonth()];
        var dayOfTheWeek  = daysOfTheWeek[date.getDay()];
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        var minutesString :string = minutes < 10 ? '0'+ minutes : '' + minutes;
        return Promise.resolve({text:`It's ${hours}:${minutesString} ${ampm} on ${dayOfTheWeek} ${month} ${day}, ${year}.`});
    },

    greeting: function() {
        let hours = new Date().getHours();
        let text = hours>=0 && hours<12 ? "Good Morning." : hours>=12 && hours<18 ? "Good Afternoon." : "Good Evening.";
        return Promise.resolve({text: text})
    },

    wikipedia: async function(statement :string){
        let extract :string = "";
        let summary :any = {};
        let keywords = await commands.keywords(statement);
        try {
            summary = await API.get('wikipedia', '/wikipedia', {
                queryStringParameters: { 
                    query: keywords.text.split(',')[0]
                }
            })
        } catch (e) {
            console.error(e);
            return {text:""};
        }
        return {text:summary.extract, image: summary && summary.thumbnail ? summary.thumbnail.source : "" };
    },

    acknowledge: function(statement :string) {
        session.set({active: true});
        let acks = ["Yes?", "Sup.", "I hear you."]
        return Promise.resolve({text:getRandomItemFrom(acks)});
    },

    getName: function(){
        return Promise.resolve({text: `I'm ${session.get().name}.`})
    },

    thanks: function(){
        let acks = ["Thank you", "I try", "That's why I'm here."]
        return Promise.resolve({text:getRandomItemFrom(acks)});
    },

    youAreWelcome: function(){
        let acks = ["No problem", "You are welcome", "You are very welcome."]
        return Promise.resolve({text:getRandomItemFrom(acks)});
    },

    hello: function(){
        return Promise.resolve({text:"Hello."})
    },

    voices: ()=>{
        let voices = window.speechSynthesis.getVoices().map((voice :any, index :number)=>{ return index + " " +voice.name });
        return Promise.resolve({text:voices.join(','), speak:false})
    },

    setVoice: (statement :string)=>{
        let voice = parseInt(statement.replace( /^\D+/g, ''), 10);
        if(voice >= 0){
            session.set({voice:voice});
            return Promise.resolve({text:"How do I sound now?"})
        } else {
            return Promise.resolve({text:"I need the number of the voice you want."})
        }
    },

    weather: async (statement :string)=> {
        let city = statement.split('in')[1] || session.get().city
        let result = await API.get('weather', '/weather', {
            queryStringParameters: { 
                city: city
            }
        })
        let text = "";
        if(result.weather && result.weather.length > 0) {
            let description = `It's ${result.weather[0].description}. `;
            let tempature = `The temperature is ${result.main.temp} degrees Farenhiet, but feels like ${result.main.feels_like}. `;
            let humidity = `The humidity is ${result.main.humidity} percent.`
            text = description + tempature + humidity;
        } else {
            text = `I couldn't find the weather for ${city}.`
        }

        return {text:text};
    },

    tryAgain: () => {
        let acks = ["Come again?", "Can you say that again?", "I beg your pardon?", "I may not have an answer for that.  Try saying that another way."];
        return Promise.resolve({text:getRandomItemFrom(acks)});
    },

    status: () => {
        let acks = ["I am a program.  I have no feelings.  But if it makes you feel better, I'm fantastic.", "Considering the circumstances, good.", "I feel like a koala bear crapped a rainbow on my brain."];
        return Promise.resolve({text:getRandomItemFrom(acks)});
    }, 

    wolfram: async (statement :string) => {
        let response = "";
        let result = await API.get('wolfram', '/wolfram', {
            queryStringParameters: { 
                query: statement
            }
        })
        if(result && result.pods){
            let resultPod = result.pods.find((item :any) => { return item.title === 'Result'});
            response = resultPod && resultPod.subpods ? resultPod.subpods[0].plaintext : ""
        }
        return { text: response };
    },

    read: async(statement :string) => {
        let meta = session.get().meta;
        let text = "";
        let image = "";
        if(!meta || meta.articles.length == 0){
            text = "I'm not sure what you're talking about."
        } else {
            let article :Link = meta.articles[0];
            let response = await commands.scrape(article.url);
            text = response.text;
            image = response.image;
        }
        return {text: text, image: image}
    },

    news: async(statement :string) => {
        let response = "";
        let query = await commands.keywords(statement);
        let image :any = null;
        let url :string = "";
        let meta = [];
        let result = await API.get('news', '/news', {
            queryStringParameters: { 
                query: query.text.replace('news', '').split(',')[0],
                //sources: session.get().newSources,
                pageSize:10
            }
        })
        console.log(result);

        if(result && result.articles && result.articles.length > 0){
            let first = result.articles[0];
            let image = first.urlToImage;
            let url = first.url;
            response = `I found ${result.articles.length} articles: ` + result.articles.map((item :any, index :number)=>`${index + 1}. ${item.title}`).join(" ");
            meta = result.articles.map((item :any)=>{return {url: item.url}})
        }
        return { text: response, image: image, url:url, meta: {articles: meta }};
    },

    openai: async(statement :string) => {
        let result = await API.get('openai', '/openai', {
            queryStringParameters: { 
                prompt: `\nHuman:${statement} \n AI:`
            }
        })
        console.log(result);
        return { text: result.choices.length ? result.choices[0].text : ''};
    },

    keywords: async(statement :string) => {
        let result = await API.get('openai', '/openai', {
            queryStringParameters: { 
                prompt: statement,
                type: 'keywords'
            }
        })
        console.log(result);
        return { text: result.choices.length ? result.choices[0].text : ''};
    },

    classify: async(statement :string) => {
        let result = await API.get('openai', '/openai', {
            queryStringParameters: { 
                prompt: statement,
                type: 'classify'
            }
        })
        console.log(result);
        return { text: result.choices.length ? result.choices[0].text : ''};
    },

    rundown: async() => {
        let result =  await Promise.all([commands.getTheTime(), commands.weather(session.get().city), commands.news("")]);
        let text = result.map((response)=>{ return response.text}).join(' ');
        return {text:text};
    },

    hypothesize: async(statement :string) => {
        let classify = await commands.classify(statement);
        console.log("Classification", classify.text.trim());
        switch(classify.text.trim()){
            case "Internal":
                return commands.openai(statement);
            case "Computation":
                return commands.wolfram(statement);
            default:
                return commands.google(statement);
        }
    },

    stop: async(statement :string) => {
        let response :Response = await commands.openai(statement);
        response.sleep = true;
        return response;
    },

    leroy: async() => {
        let text = ""
        let image;
        try {
            let records = await window.fetch('http://10.0.4.79/visitations.json', {mode: 'cors'}).then(res => res.json());
            text = `Leroy was visited ${records.length} ${records.length > 1 ? "times" : "time"} including `;
            let names = records.map((visit :any)=>{ return visit.species })
            names = Array.from(new Set(names));
            names.forEach((name :string, index :number)=>{
                if(index == names.length -1 && names.length > 1) {
                    text += 'and ';
                }
                text += name;
                if(index == names.length -1) {
                    text += '. ';
                } else {
                    text += ', ';
                }
            })
            image = records.length > 0 ? `http://10.0.4.79${records[records.length -1]['best_photo']}` : null;
        } catch (e) {
            console.error(e);
            text = getRandomItemFrom(["Leroy is not responding.", "I'm unable to reach Leroy.", "Leroy is ignoring me right now."])
        }
    
        return {text: text, image: image}
    },

    google: async(statement :string) => {
        let text = "";
        let link = "";
        let meta = [];
        let result = await API.get('google', '/google', {
            queryStringParameters: { 
                query: statement
            }
        })
        console.log(result);
        if(result.results.length) {
            text += result.results[0].title;
            text += result.results[0].description;
            link = result.results[0].link;
            meta = result.results.map((item :any)=>{return {url: item.link}});
        }
        return { text: text, meta: {articles: meta}, url: link};
    },

    face: async(statement :string) => {
        let a = statement.split('to a');
        let an = statement.split('to an');
        console.log('a', a, 'an', an);
        if(a.length > 1) statement = a[1];
        if(an.length > 1) statement = an[1];
        console.log("query", statement);
        let results = face.search(statement.trim());
        let text = "I don't have a face like that.";
        if(results.length > 0) {
            session.set({face: results[0].emoji});
            text = "how do I look now?";
        }
        console.log('emojis', results);
        return { text: text };
    },

    scrape: async(url :string) => {
        let result = await API.get('scrape', '/scrape', {
            queryStringParameters: { 
                url: url
            }
        })
        console.log(result);
        return { text: `${result.title} ${result.article}`, image: result.image };
    },

    findAndRead: async (statement :string) => {
        let query = statement.split('read me')[1].trim();
        if (query === "") {
            return {text: "What do you want me to read?"};
        } else {
            let results = await commands.google(query);
            if(results.meta.articles.length == 0) {
                return {text: "I couldn't find what you're looking for?"};
            } else {
                let url = results.meta.articles[0].url;
                let scrape = await commands.scrape(url)
                return { text: scrape.text, image: scrape.image, url: url }
            }
        }
    },

    capabilities: async() => {
        return { text: "I am able to tell you the weather, the time, find and read information, and peform a range of calcuations.  You can can change my voice or my face to any emoji.  We can have a conversation." }
    }


}

export default commands;