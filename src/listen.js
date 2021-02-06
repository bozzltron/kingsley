var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

function listen() {
    return new Promise((resolve, reject) => {

        let grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ;';
        let recognition = new SpeechRecognition();
        let speechRecognitionList = new SpeechGrammarList();

        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onerror = reject;

        recognition.onresult = (event) => {
            console.log("gathered result", event.results);
            resolve(event.results);
        };

        recognition.start();

    })
}

export default listen;