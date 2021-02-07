const WolframAlphaAPI = require('wolfram-alpha-api');
async function go() {
    
 try {
    const waApi = WolframAlphaAPI(process.env.API_KEY);
    let result = await waApi.getFull('HOW MANY STATES IN THE UNITED STATES');
    console.log(JSON.stringify(result, 2, 2))
    let resultPod = result.pods.find((item) => { return item.title === 'Result'});
    console.log('result pod', resultPod)
    console.log('solution', resultPod.subpods[0].plaintext);
 } catch (e) {
     console.log(e);
 }

}

go();