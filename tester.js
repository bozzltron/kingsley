let fetch = require('node-fetch');


let city = "Waukee,Iowa"

const result = fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${api_key}&q=${city}&units=imperial`).then(res => res.json()).then((result)=>{
    console.log("result", result);
})

