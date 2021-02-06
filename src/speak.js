import session from './session';
var synth = window.speechSynthesis;

export default function speak(text) {
    if (synth.speaking || !text) {
        synth.cancel();
    }

    if(text.length > 300) {
        text = "I'll let you read this."
    }

    return new Promise( (resolve,reject) => {
        var mouth = new SpeechSynthesisUtterance(text);
        var voices = synth.getVoices();
        let voiceIndex = session.get().voice;
        let interval;

        mouth.voice = voices[voiceIndex];
        mouth.pitch = 1;
        mouth.rate = 1;
        mouth.onerror = reject;
        mouth.onend = ()=>{
            clearInterval(interval);
            resolve();
        };

        synth.speak(mouth);
        interval = setInterval(() => { 
            synth.pause(); 
            synth.resume(); 
        }, 1000);

    });;
}