import speak from './speak'
// import WordPOS from 'wordpos'
// import {JSONPath} from 'jsonpath-plus';
// const wordpos = new WordPOS({});

export default {

    getTheTime: ()=>{
        var date = new Date();
        var hours = date.getHours();
        var minutes :number = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        var minutesString :string = minutes < 10 ? '0'+ minutes : '' + minutes;
        return hours + ':' + minutesString + ' ' + ampm;
    },

    greeting: function() {
        var hours = new Date().getHours();
        return hours>=0 && hours<12 ? "Good Morning" : hours>=12 && hours<18 ? "Good Afternoon" : "Good Evening"
    },

    wikipedia: async function(query :string){
        speak("Searching wikipedia");
        //let nouns = wordpos.getNouns(query.replace("wikipedia", "")); 
        let nouns = query.replace('wikipedia', '')
        let extract = await window.fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${nouns}`, 
            { mode: 'no-cors', headers: {'Accept': 'application/json' }, })
            .then(response => response.json())
            .then(json => {
                let pages = json.query.pages;
                let keys = Object.keys(pages);
                let page = pages[keys[0]];
                return page.extract;
            })
        return extract.length > 0 ? extract[0] : extract;
    }

}
