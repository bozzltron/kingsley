import commands from './commands'
import listen from './listen'
import speak from './speak'
import { SpeechEvent } from "./types";

var ear = listen(true);
var input = document.querySelector(".input");
var output = document.querySelector(".output");
var name = "Kingsley";

var el :HTMLElement = document.querySelector('.activate');
el.onclick = function(e :Event){
  var target = e.target as HTMLElement;
  target.remove();
  var mouth = speak(commands.greeting() + ". I'm " + name);

  mouth.onstart = function (event :Event) {
    try { 
      console.log("stop listening");
      ear.stop();
    } catch (e) {
  
    }
  }
  
  mouth.onend = function (event :Event) {
    try {
      console.log("listenting resumed");
      ear.start();
    } catch(e) {
  
    }
  }  

}

function respond(response :string) {
  output.textContent = "response: " + response;
  speak(response);
}

ear.onresult = function (event :SpeechEvent) {
  var statement = event.results[0][0].transcript.toLowerCase();
  input.textContent = "I heard: " + statement;
  console.log('Confidence: ' + event.results[0][0].confidence);

  if(statement.includes("what time is it") || statement.includes("do you have the time")){
    respond(commands.getTheTime());
  }

  if(statement.includes("what's your name")) {
    respond("I'm " + name);
  }

  if(statement.includes("wikipedia")) {
    speak("Searching wikipedia");
    commands.wikipedia(statement);
    //respond("I'm " + name);
  }
}
