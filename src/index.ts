import 'url-search-params-polyfill';
import listen from './listen'
import speak from './speak'
import interpret from './interpret'
import commands from './commands'
import "./style.css";
import session from './session'

session.init();

var el: HTMLElement = document.querySelector('.activate');

function clearMessages() {
  document.querySelector('.messages').innerHTML = '';
}

function createMessage(message: string) {
  let el = document.createElement('div');
  el.className = 'message';
  el.textContent = message;
  document.querySelector('.messages').appendChild(el);
}

function respond(response :string) {
  if (!response) return Promise.resolve();
  if(session.get().active) {
    createMessage("Response: " + response);
    return speak(response);
  } else {
    createMessage(`Are you talking to me? "Say, hey ${session.get().name}".`);
    return Promise.resolve();
  }
}

function sleep(seconds :number) {
  return new Promise((resolve)=>{
    setTimeout(resolve, seconds * 1000);
  })
}

el.onclick = async (e: Event) => {

  console.log('say greeting')
  await speak(await commands.greeting() + ". I'm " + session.get().name);

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
        createMessage("I heard: " + statement);
        let response = await interpret(statement);
        await respond(response);
        if (confidence < 0.5 && session.get().active) {
          await respond("Can you speak clearly?  I didn't hear you very well.")
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

