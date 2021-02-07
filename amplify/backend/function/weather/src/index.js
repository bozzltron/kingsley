const fetch = require('node-fetch');

exports.handler = async (event) => {
    let response = {};

    if(event.httpMethod == 'OPTIONS'){
        return {
            statusCode: 200,            
            headers: {
                "Access-Control-Allow-Headers" : "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: {}
        }
    }

    try {
        let city = event.queryStringParameters['city'];
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${process.env.API_KEY}&q=${city}&units=imperial`).then(res => res.json())
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.log(error);
        response = {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: error
        }
    }

    return response;
};