var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

export default function listen(forever) {
    var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ;';
    var recognition = new SpeechRecognition();
    //var speechRecognitionList = new SpeechGrammarList();
    //speechRecognitionList.addFromString(grammar, 1);
    //recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    console.log("listen: listening...");

    // if(forever) {
    //     recognition.onend = function (event) {
    //         try {
    //             recognition.stop();
    //             setTimeout(()=>{
    //                 recognition.start();
    //                 console.log("onend: listening...");
    //             }, 1000)
                
    //         } catch(e) {
                
    //         }
    //       }
    // }

    return recognition;
}