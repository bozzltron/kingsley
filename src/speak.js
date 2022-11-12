import session from "./session";
var synth = window.speechSynthesis;

export default function speak(text) {
  if (synth.speaking || !text) {
    synth.cancel();
  }

  return new Promise((resolve, reject) => {
    if (text) {
      var mouth = new SpeechSynthesisUtterance(text);
      var voices = synth.getVoices();
      let voiceIndex = session.get().voice;
      let interval;

      //mouth.voice = voices[voiceIndex];
      mouth.pitch = 1;
      mouth.rate = 0.9;
      mouth.onerror = (e) => {
        console.error("Can't read string", text);
        reject(e);
      };
      mouth.onend = () => {
        clearInterval(interval);
        resolve();
      };

      synth.speak(mouth);
      // interval = setInterval(() => {
      //     synth.pause();
      //     synth.resume();
      // }, 1000);
    }
  });
}
