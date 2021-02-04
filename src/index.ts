import listen from './listen'
import speak from './speak'
import interpret from './interpret'
import { SpeechEvent } from "./types";
import commands from './commands'
import "./style.css";

var input = document.querySelector(".input");
var output = document.querySelector(".output");
var name = "Kingsley";
var el :HTMLElement = document.querySelector('.activate');

function clearMessages() {
  document.querySelector('.messages').innerHTML = '';
}

function createMessage(message :string){
  let el = document.createElement('div');
  el.className = 'message';
  el.textContent = message;
  document.querySelector('.messages').appendChild(el);
}

function respond(response :string) {
  createMessage("Response: " + response);
  speak(response);
  setTimeout(()=>{
    clearMessages();
  }, 20000)
}

function handler(event :SpeechEvent) {
  clearMessages();
  console.log('onresult', event);
  var statement = event.results[0][0].transcript.toLowerCase();
  let confidence = event.results[0][0].confidence;
  createMessage("I heard: " + statement);
  output.textContent = "";
  console.log('Confidence: ' + event.results[0][0].confidence);
  if(confidence < 0.5) {
    respond("Can you speak clearly?  I didn't hear you very well.")
  }
  interpret(statement).then(respond);
}

el.onclick = async function(e :Event){

  var mouth = speak(await commands.greeting() + ". I'm " + name);
  var ear = listen(handler);
  var listening = false;
  var startListening =  ()=>{
    return setInterval(()=>{
      if(!listening){
        console.log("start listening");
        ear.start();
        listening = true;
      }
    }, 1000);
  }
  var interval = startListening();

  mouth.onstart = (event :Event) => {
    console.log("stop listening");
    console.log("start speaking");
    ear.stop();
    listening = false;
    clearInterval(interval);
  }  

  mouth.onend = (event :Event) => {
    console.log("stop speaking");
    setTimeout(()=>{
      interval = startListening();
    },1000)
  }  

  ear.onend = () => {
    console.log("stop listening");
    listening = false;
  }

}

