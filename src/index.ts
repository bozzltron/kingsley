import 'url-search-params-polyfill'
import listen from './listen'
import speak from './speak'
import interpret from './interpret'
import commands from './commands'
import "./style.css";
import session from './session'
import { Response } from './interfaces'

var el: HTMLElement = document.querySelector('.activate');

function clearMessages() {
  document.querySelector('.messages').innerHTML = '';
}

function createMessage(response :Response) {
  let el = document.createElement('div');
  el.className = 'message';
  
  if(response.image){
    let img = document.createElement('img');
    img.src = response.image;
    el.appendChild(img);
  }

  if(response.text) {
    let p = document.createElement('p');
    p.textContent = response.text;
    el.appendChild(p);
  }
  
  document.querySelector('.messages').appendChild(el);
}

function respond(response :Response) {
  response.speak = response.speak !== false;
  if (!response) return Promise.resolve();
  if(session.get().active) {
    if(response.text === "") {
      response.text = "I didn't find anything"
    }
    if(response.meta) {
      session.set({meta: response.meta});
    }
    createMessage(Object.assign({}, response, {text: "Response:" + response.text}));
    return response.speak ? speak(response.text) : Promise.resolve();
  } else {
    createMessage({text:`Are you talking to me? "Say, hey ${session.get().name}".`});
    return Promise.resolve();
  }
}

function sleep(seconds :number) {
  return new Promise((resolve)=>{
    setTimeout(resolve, seconds * 1000);
  })
}

createMessage({text:"Tap me to get started."});

el.onclick = async (e: Event) => {

  clearMessages();
  session.activate();
  let greeting = await commands.greeting();
  let mouth = await speak(greeting.text + ". I'm " + session.get().name);
  sleep(0.5);

  while (true) {
    try {
      console.log('start listening')
      let results = await listen();
      console.log('handle results', results);
      for (let i = 0; i < results.length; i++) {
        let result = results[i][0];
        var statement = result.transcript.toLowerCase();
        let confidence = result.confidence;
        clearMessages();
        createMessage({text: "I heard: " + statement});
        let response;
        try {
          response = session.get().active || statement.split(' ').includes("kingsley") ? await interpret(statement) : await Promise.resolve({text: ''});
        } catch (e) {
          console.error(e);
        }
        await respond(response);
        if (confidence < 0.5 && session.get().active) {
          await respond({text:"Can you speak clearly?  I didn't hear you very well."})
        }         
      }
      await sleep(0.1);
    } catch (e) {
      if(e.error != 'no-speech') {
        console.error(e);
      }
    }
  }

}

