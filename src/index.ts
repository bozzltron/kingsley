import listen from './listen'
import speak from './speak'
import interpret from './interpret'
import { SpeechEvent } from "./types";
import commands from './commands'

var input = document.querySelector(".input");
var output = document.querySelector(".output");
var name = "Kingsley";
var el :HTMLElement = document.querySelector('.activate');

function handler(event :SpeechEvent) {
  console.log('onresult', event);
  var statement = event.results[0][0].transcript.toLowerCase();
  input.textContent = "I heard: " + statement;
  output.textContent = "";
  console.log('Confidence: ' + event.results[0][0].confidence);
  interpret(statement).then((response)=>{
    output.textContent = "response: " + response;
    speak(response);
  })
}

el.onclick = function(e :Event){
  var target = e.target as HTMLElement;
  target.remove();

  var mouth = speak(commands.greeting() + ". I'm " + name);
  var ear = listen(handler);
  var listening = false;
  var startListening =  ()=>{
    return setInterval(()=>{
      if(!listening){
        ear.start();
        listening = true;
      }
    }, 1000);
  }
  var interval = startListening();

  mouth.onstart = (event :Event) => {
    ear.stop();
    listening = false;
    clearInterval(interval);
  }  

  mouth.onend = (event :Event) => {
    interval = startListening();
  }  

  ear.onend = () => {
    listening = false;
  }

}

