var synth = window.speechSynthesis;

export default function speak(text) {
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }

    return new Promise( (resolve,reject) => {
        var mouth = new SpeechSynthesisUtterance(text);
        mouth.onerror = reject;
        var voices = synth.getVoices();
        let voiceIndex = localStorage.getItem('voice') ? parseInt(localStorage.getItem('voice'), 10) : 0;
        mouth.voice = voices[voiceIndex];
        mouth.pitch = 1;
        mouth.rate = 1;
        synth.speak(mouth);
        mouth.onend = resolve;
    });;
}