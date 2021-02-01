var mouth = speak("Hello, I'm Kingsley.");
var ear = listen(true);
var output = document.querySelector(".output");

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

ear.onresult = function (event) {
  var statement = event.results[0][0].transcript.toLowerCase();
  output.textContent = "I heard: " + statement;
  console.log('Confidence: ' + event.results[0][0].confidence);

  if(statement.includes("time")){
    speak(commands.getTheTime());
  }
}

