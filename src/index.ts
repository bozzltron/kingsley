import 'url-search-params-polyfill'
import listen from './listen'
import speak from './speak'
import interpret from './interpret'
import commands from './commands'
import "./style.css";
import session from './session'
import { Response } from './interfaces'
import face from './face'
import { facebookSignInButton } from 'aws-amplify'

var el: HTMLElement = document.querySelector('.activate');
var timeout :any;

function clearMessages() {
  document.querySelector('.messages').innerHTML = '';
}

function createMessage(response: Response) {
  let el = document.createElement('div');
  el.className = 'message';

  let wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (response.image) {
    let img = document.createElement('img');
    img.src = response.image;
    wrap.appendChild(img);
  }

  if (response.text) {
    let p = document.createElement('p');
    p.textContent = response.text;
    wrap.appendChild(p);
  }

  el.appendChild(wrap);
  document.querySelector('.messages').appendChild(el);
}

const startTimeout = ()=>{
  return setTimeout(()=>{
    session.set({active: false});
  }, 30000)
}

function respond(response: Response) {
  if (!response) return Promise.resolve();
  response.speak = response.speak !== false;

  clearTimeout(timeout);
  timeout = startTimeout();

  if (session.get().active) {
    if (response.text === "") {
      face.update('disappointed');
      response.text = "I didn't find anything"
    } else {
      face.update('open_mouth');
    }
    if (response.meta) {
      session.set({ meta: response.meta });
    }
    createMessage(Object.assign({}, response, { text: "Response: " + response.text }));
    return response.speak ? speak(response.text) : Promise.resolve();
  } else {
    createMessage({ text: `Saying "${session.get().name}" will wake me up.` });
    return Promise.resolve();
  }
}

function sleep(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  })
}

createMessage({ text: "Tap me to get started." });

el.onclick = async (e: Event) => {

  clearMessages();
  session.set({active: true});
  face.update('open_mouth');
  let greeting = await commands.greeting();
  let mouth = await speak(greeting.text + ". I'm " + session.get().name);
  timeout = startTimeout();
  sleep(0.5);

  while (true) {
    try {
      session.get().active ? face.update(session.get().face) : face.update('sleeping');
      console.log('start listening')
      let results = await listen();
      console.log('handle results', results);
      for (let i = 0; i < results.length; i++) {
        console.log("recognition", results);
        let result = results[i][0];
        var statement = result.transcript.toLowerCase();
        let confidence = result.confidence;
        clearMessages();
        createMessage({ text: "I heard: " + statement });
        let response: Response;
        try {
          if (statement.split(' ').includes(session.get().name.toLowerCase())) {
            session.set({ active: true });
            console.log("reactivated!", "session", session.get());
          };
          if (session.get().active) {
            face.update('thinking_face');
            response = await interpret(statement);
            console.log("response", response);
          } else {
            await Promise.resolve({ text: '' });
          }

        } catch (e) {
          console.error(e);
        }
        session.set({conversation: session.get().conversation + ` \n Human: ${statement} \n AI: ${response.text}`});
        await respond(response);
        if (confidence < 0.5 && session.get().active) {
          face.update('confused');
          await respond({ text: "Can you speak clearly?  I didn't hear you very well." })
        }
        if(response.sleep === true) session.set({ active: false, conversation: "" });
      }
    } catch (e) {
      if (e.error != 'no-speech') {
        console.error(e);
      }
    }
  }

}

