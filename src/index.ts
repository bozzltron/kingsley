import 'url-search-params-polyfill'
import { v4 as uuidv4 } from 'uuid';
import debug from './debug';
import listen from './listen'
import speak from './speak'
import interpret from './interpret'
import commands from './commands'
import "./style.css";
import session from './session'
import { Response } from './interfaces'
import face from './face'
import respond from './respond'
import messages from './messages' 
import timer from './timer';
import api from './api';

var el: HTMLElement = document.querySelector('.activate');

function sleep(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  })
}

debug() || messages.create({ text: "Tap me to get started." });

let conversationMode = async (e: Event) => {

  messages.clear();
  face.update('open_mouth');
  let greeting = await commands.greeting();
  await speak(greeting.text + ". I'm " + session.get().name);
  timer.start();
  session.set({ id:uuidv4()});
  sleep(0.5);

  while (true) {
    try {
      session.get().active ? face.update(session.get().face) : face.update('sleeping');
      console.log('start listening')
      sleep(0.5);
      let results = await listen();
      console.log('handle results', results);
      for (let i = 0; i < results.length; i++) {
        console.log("recognition", results);
        let result = results[i][0];
        var statement = result.transcript.toLowerCase();
        let confidence = result.confidence;
        messages.clear();
        messages.create({ text: "I heard: " + statement });
        let response: Response;
        try {
          if (statement.split(' ').includes(session.get().name.toLowerCase())) {
            session.set({ active: true });
            console.log("reactivated!", "session", session.get());
          };
          if (session.get().active) {
            face.update('thinking_face');
            timer.stop();
            response = await api({
              statement: statement,
              confidence: confidence,
              conversation: session.get().id
            });
            timer.start();
          } else {
            await Promise.resolve({ text: '' });
          }

        } catch (e) {
          console.error(e);
          response = {text: ''}
        }
        await respond(response);
        if (confidence < 0.2 && session.get().active) {
          face.update('confused');
          await respond({ text: "Can you speak clearly?  I didn't hear you very well." })
        }
        if(response && response.sleep === true) session.set({ active: false });
      }
    } catch (e) {
      if (e.error != 'no-speech') {
        console.error(e);
      }
    }
  }

};

el.onclick = conversationMode;
