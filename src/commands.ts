import Amplify, { API } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

export default {

    getTheTime: ()=>{
        var date = new Date();
        var hours = date.getHours();
        var minutes :number = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        var minutesString :string = minutes < 10 ? '0'+ minutes : '' + minutes;
        return Promise.resolve(hours + ':' + minutesString + ' ' + ampm);
    },

    greeting: function() {
        var hours = new Date().getHours();
        return Promise.resolve(hours>=0 && hours<12 ? "Good Morning" : hours>=12 && hours<18 ? "Good Afternoon" : "Good Evening")
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
        return extract;
    },

    acknowledge: function(statement :string) {
        let random = Math.floor(Math.random() * 3 + 1);
        let acks = ["Yes?", "Sup", "I hear you"]
        return Promise.resolve(acks[random]);
    },

    getName: function(){
        return Promise.resolve("I'm Kingsley")
    },

    thanks: function(){
        let random = Math.floor(Math.random() * 3 + 1);
        let acks = ["Thank you", "I try", "That's why I'm here."]
        return Promise.resolve(acks[random]);
    },

    youAreWelcome: function(){
        let acks = ["No problem", "You are welcome", "You are very welcome."]
        let random = Math.floor(Math.random() * acks.length + 1);
        return Promise.resolve(acks[random]);
    },

    hello: function(){
        return Promise.resolve("Hello")
    },

    voices: ()=>{
        let voices = window.speechSynthesis.getVoices().map((voice :any, index :number)=>{ return index + " " +voice.name });
        return Promise.resolve(voices.join(','))
    },

    setVoice: (statement :string)=>{
        let voice = parseInt(statement.replace( /^\D+/g, ''), 10);
        if(voice >= 0){
            localStorage.setItem('voice', String(voice));
            return Promise.resolve("How do I sound now?")
        } else {
            return Promise.resolve("I need the number of the voice you want.")
        }
    },

    weather: (statement :string)=> {
        // base_url="https://api.openweathermap.org/data/2.5/weather?"
        // city_name="Waukee, Iowa"
        // if "in" in statement:
        //     city_name = statement.split("in")[1]
        // complete_url=base_url+"appid="+api_key+"&q="+city_name+"&units=imperial"
        // response = requests.get(complete_url)
        // x=response.json()
    }

}
