import Amplify, { API } from 'aws-amplify';
import awsconfig from './aws-exports';
import session from './session';
Amplify.configure(awsconfig);

export default {

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
        return Promise.resolve({text:`${hours}:${minutesString} ${ampm} on ${dayOfTheWeek} ${month} ${day}, ${year}`});
    },

    greeting: function() {
        let hours = new Date().getHours();
        let text = hours>=0 && hours<12 ? "Good Morning" : hours>=12 && hours<18 ? "Good Afternoon" : "Good Evening";
        return Promise.resolve({text: text})
    },

    wikipedia: async function(statement :string){
        //let nouns = wordpos.getNouns(query.replace("wikipedia", "")); 
        let extract :string = "I didn't find anything";
        try {
            let noun = statement
                        .replace('tell me about', '')
                        .replace('what is', '')
                        .replace('what are', '')
                        .replace('who are', '')
                        .replace('who is', '');
            let summary = await API.get('wikipedia', '/wikipedia', {
                queryStringParameters: { 
                    query: noun
                }
            })
            extract = summary.extract;
        } catch (e) {
            console.error(e);
        }
        return {text:extract};
    },

    acknowledge: function(statement :string) {
        session.activate();
        let acks = ["Yes?", "Sup", "I hear you"]
        let random = Math.floor(Math.random() * acks.length + 1);
        return Promise.resolve({text:acks[random]});
    },

    getName: function(){
        return Promise.resolve({text: `I'm ${session.get().name}`})
    },

    thanks: function(){
        let random = Math.floor(Math.random() * 3 + 1);
        let acks = ["Thank you", "I try", "That's why I'm here."]
        return Promise.resolve({text:acks[random]});
    },

    youAreWelcome: function(){
        let acks = ["No problem", "You are welcome", "You are very welcome."]
        let random = Math.floor(Math.random() * acks.length + 1);
        return Promise.resolve({text:acks[random]});
    },

    hello: function(){
        return Promise.resolve({text:"Hello"})
    },

    voices: ()=>{
        let voices = window.speechSynthesis.getVoices().map((voice :any, index :number)=>{ return index + " " +voice.name });
        return Promise.resolve({text:voices.join(',')})
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
        let city = statement.split('in').length > 1 ? statement.split('in')[1] : session.get().city;
        let result = await API.get('weather', '/weather', {
            queryStringParameters: { 
                city: city
            }
        })
        let text = "";
        if(result.weather.length > 0) {
            let description = `It's ${result.weather[0].description}. `;
            let tempature = `The tempertature is ${result.main.temp} degrees Farenhiet, but feels like ${result.main.feels_like}. `;
            let humidity = `The humidity is ${result.main.humidity} percent.`
            text = description + tempature + humidity;
        } else {
            text = `I couldn't find the weather for ${city}`
        }

        return {text:text};
    },

    tryAgain: () => {
        let acks = ["Come again?", "Can you say that again?", "I beg your pardon?", "I may not have an answer for that.  Try saying that another way."]
        let random = Math.floor(Math.random() * acks.length + 1);
        return Promise.resolve({text:acks[random]});
    },

    status: () => {
        let acks = ["I am a program.  I have no feelings.  But if it makes you feel better, I'm fantastic.", "Considering the circumstances, good.", "I feel like a koala bear crapped a rainbow on my brain."]
        let random = Math.floor(Math.random() * acks.length + 1);
        return Promise.resolve({text:acks[random]});
    }

}
