import listen from './listen'
import speak from './speak'
import interpret from './interpret'
import { SpeechEvent } from "./types";
import commands from './commands'

var ear = listen(true);
var input = document.querySelector(".input");
var output = document.querySelector(".output");
var name = "Kingsley";

var el :HTMLElement = document.querySelector('.activate');
var introduced = false;
el.onclick = function(e :Event){
  var target = e.target as HTMLElement;
  //target.remove();
  if(!introduced){
    var mouth = speak(commands.greeting() + ". I'm " + name);
    introduced = true;
  }
  listen();

  // mouth.onstart = function (event :Event) {
  //   try { 
  //     console.log("stop listening");
  //     ear.stop();
  //   } catch (e) {
  
  //   }
  // }
  
  // mouth.onend = function (event :Event) {
  //   try {
  //     console.log("listenting resumed");
  //     ear.start();
  //   } catch(e) {
  
  //   }
  // }  

}

function respond(response :string) {
  output.textContent = "response: " + response;
  speak(response);
}

ear.onresult = function (event :SpeechEvent) {
  var statement = event.results[0][0].transcript.toLowerCase();
  input.textContent = "I heard: " + statement;
  console.log('Confidence: ' + event.results[0][0].confidence);
  interpret(statement).then((response)=>{
    respond(response);
  })
}
