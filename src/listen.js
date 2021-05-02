var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList || null;
var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent || null;

function listen() {
    return new Promise((resolve, reject) => {

        
        let recognition = new SpeechRecognition();
        let speechRecognitionList;

        if(SpeechGrammarList) {
            let grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ;';
            speechRecognitionList = new SpeechGrammarList();
            speechRecognitionList.addFromString(grammar, 1);
            recognition.grammars = speechRecognitionList;
        }
        
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onerror = reject;

        recognition.onresult = (event) => {
            recognition.stop();
            console.log("gathered result", event.results);
            resolve(event.results);
        };

        recognition.onend = (event) => {
            recognition.stop();
            resolve({results: []});
        };

        recognition.onabout = (event) => {
            recognition.stop();
            resolve({results: []});
        };

        recognition.stop();
        recognition.start();

    })
}

export default listen;