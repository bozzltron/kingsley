import Amplify, { API } from 'aws-amplify';
import awsconfig from './aws-exports';
import session from './session';
import { Response, Article } from './interfaces'

Amplify.configure(awsconfig);

function getRandomItemFrom(array :Array<string>) {
    return array[Math.floor(Math.random() * array.length)];
}

function removeFromCommaSeparatedString(string :string, key :string){
    return string.split(',').filter((item)=>{ return item != key;}).join().trim()
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
        if(result.weather.length > 0) {
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
        let text;
        let image;
        if(!meta || meta.articles.length == 0){
            text = "I'm not sure what you're talking about."
        } else {
            let article :Article = meta.articles[0];
            text = article.content;
            image = article.urlToImage;
        }
        return {text: text, image: image}
    },

    news: async(statement :string) => {
        let response = "";
        let query = await commands.keywords(statement);
        let image :any = null;
        let url :string = "";
        let result = await API.get('news', '/news', {
            queryStringParameters: { 
                query: query.text.replace('news', ''),
                //sources: session.get().newSources,
                pageSize:10
            }
        })
        console.log(result);

        if(result && result.articles && result.articles.length > 0){
            let first = result.articles[0];
            let image = first.urlToImage;
            let url = first.url;
            response = `I found ${result.articles.length} articles: ` + result.articles.map((item :Article, index :number)=>`${index + 1}. ${item.title}`).join(" ");
        }
        return { text: response, image: image, url:url, meta: {articles: result.articles }};
    },

    openai: async(statement :string) => {
        let result = await API.get('openai', '/openai', {
            queryStringParameters: { 
                prompt: statement
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

    rundown: async() => {
        let result =  await Promise.all([commands.getTheTime(), commands.weather(session.get().city), commands.news("")]);
        let text = result.map((response)=>{ return response.text}).join(' ');
        return {text:text};
    },

    hypothesize: async(statement :string) => {
        let sorted :Response [];
        try {
            let results :Response[] = await Promise.all([commands.wolfram(statement), commands.wikipedia(statement)])
            sorted = results.sort((a, b) => {
                if( a.text.length > b.text.length ) return -1;
                if( a.text.length > b.text.length ) return 1;
            });
        } catch (e){
            console.log("error", e);
        }
        console.log('sorted', sorted);
        return sorted.length > 0 ? sorted[0] : {text: ""}
    },

    stop: async() => {
        session.set({active: false});
        return {text: 'Ok'}
    }

}

export default commands;