import messages from './messages';

var SpeechRecognition = (<any>window).SpeechRecognition || (<any>window).webkitSpeechRecognition || (<any>window).mozSpeechRecognition || (<any>window).msSpeechRecognition || null;
var SpeechGrammarList = (<any>window).SpeechGrammarList || (<any>window).webkitSpeechGrammarList || null;
var SpeechRecognitionEvent = (<any>window).SpeechRecognitionEvent || (<any>window).webkitSpeechRecognitionEvent || null;

function supportsEmoji () {
    var ctx = document.createElement("canvas").getContext("2d");
    ctx.fillText("😗", -2, 4);
    return ctx.getImageData(0, 0, 1, 1).data[3] > 0; // Not a transparent pixel
  }

export default () => {
    const params = new URLSearchParams(window.location.search);
    
    if(params.has('debug')){
        let text = "";

        if(!SpeechRecognition) {
            text += "SpeechRecognition not supported </br/>";
        } else {
            text += "SpeechRecognition is supported </br/>";
        }

        if(!SpeechGrammarList) {
            text +=  "SpeechGrammarList not supported </br/>";
        } else {
            text += "SpeechGrammarList is supported </br/>";
        }

        if(!SpeechRecognitionEvent) {
            text += "SpeechRecognitionEvent not supported </br/>";
        } else {
            text += "SpeechRecognitionEvent is supported </br/>";
        }

        if(!window.speechSynthesis){
            text += "SpeechSynthesis not supported </br/>";
        } else {
            text += "SpeechSynthesis is supported </br/>";
        }

        if(!supportsEmoji()){
            text += "Emoji not supported </br/>";
        } else {
            text += "Emoji is supported </br/>";
        }

        messages.create({ text: text });

        return true;
    }

    return false;
}