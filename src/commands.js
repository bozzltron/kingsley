

export default {

    getTheTime: ()=>{
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+ minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    },

    greeting: function() {
        var hours = new Date().getHours();
        return hours>=0 && hours<12 ? "Good Morning" : hours>=12 && hours<18 ? "Good Afternoon" : "Good Evening"
    },

    wikipedia: async function(query){
        query = query.replace("according", "").replace("to", "").replace("wikipedia", "").replace("who").replace("is", "");
        let result = await window.fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${query}`, 
            { mode: 'no-cors', headers: {'Accept': 'application/json' }, })
            .then(response => response.json());
        console.log("result", result);
        return "done"
    }

}
