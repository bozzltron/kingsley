var synth = window.speechSynthesis;

var voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase(),
        bname = b.name.toUpperCase();
    if (aname < bname) return -1;
    else if (aname == bname) return 0;
    else return +1;
});

function speak(text) {
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }

    var mouth = new SpeechSynthesisUtterance(text);

    mouth.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }

    mouth.voice = voices[0];
    mouth.pitch = 1;
    mouth.rate = 1;
    synth.speak(mouth);
    return mouth;
}