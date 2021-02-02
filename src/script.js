var ear = listen(true);
var input = document.querySelector(".input");
var output = document.querySelector(".output");
var name = "Kingsley";

document.querySelector('.activate').onclick = function(e){
  e.target.remove();
  var mouth = speak(commands.greeting() + ". I'm " + name);

  mouth.onstart = function (event) {
    try { 
      console.log("stop listening");
      ear.stop();
    } catch (e) {
  
    }
  }
  
  mouth.onend = function (event) {
    try {
      console.log("listenting resumed");
      ear.start();
    } catch(e) {
  
    }
  }  

}

function respond(response) {
  output.textContent = "response: " + response;
  speak(response);
}

ear.onresult = function (event) {
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


