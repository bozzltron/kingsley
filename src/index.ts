import 'url-search-params-polyfill'
import { v4 as uuidv4 } from 'uuid';
import debug from './debug';
import listen from './listen'
import "./style.css";
import session from './session'
import { Response, Inquiry, Interaction } from './interfaces'
import face from './face'
import respond from './respond'
import messages from './messages' 
import timer from './timer';
import { Conversation } from './conversation';

const personality = "The following is a conversation with an AI assistant. This assistants name is Kingsley. The assistant is helpful, creative, clever, a fan of Wes Anderson, and very friendly.";

var el: HTMLElement = document.querySelector('.activate');

function sleep(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  })
}

debug() || messages.create({ text: "Tap me to get started." });

const server = window.location.href.includes("storage.googleapis.com") ? "wss://kingsley-c4k5vxdlya-uc.a.run.app" : "ws://localhost:8080";

const socket = new WebSocket(server);

// Connection opened
socket.addEventListener( 'open', (event) => {
  console.log('Connected ', event);
});

// Listen for messages
socket.addEventListener('message', async (event) => {
  console.log('Message from server ', event.data);
  const response : Response = JSON.parse(event.data);
  Conversation.add(`\nAI: ${[ response.text, response.url, response.image ].join(" ")}`);
  await respond(response);
  face.update("slightly_smiling_face");
});

let conversationMode = async (e: Event) => {

  messages.clear();
  //timer.start();
  //session.set({ id:uuidv4()});

  try {
    //session.get().active ? face.update(session.get().face) : face.update('sleeping');
    console.log('start listening')
    let results = await listen();
    console.log('handle results', results);
    for (let i = 0; i < results.length; i++) {
      console.log("recognition", results);
      let result = results[i][0];
      var statement = result.transcript.toLowerCase();
      let confidence = result.confidence;
      messages.clear();
      messages.create({ text: "I heard: " + statement });
   
      try {
        // if (statement.split(' ').includes(session.get().name.toLowerCase())) {
        //   session.set({ active: true });
        //   console.log("reactivated!", "session", session.get());
        // };
        //if (session.get().active) {
          face.update('thinking_face');
          //timer.stop();
          Conversation.add(`\nHuman: ${statement}`);
          let inquiry: Inquiry = {
            personality,
            statement,
            confidence,
            conversation: Conversation.get()
          };
          
          socket.send(JSON.stringify(inquiry));
          //timer.start();
        // } else {
        //   await Promise.resolve({ text: '' });
        // }

      } catch (e) {
        console.error(e);
      }
      
      if (confidence < 0.2 && session.get().active) {
        face.update('confused');
        await respond({ text: "Can you speak clearly?  I didn't hear you very well." })
      }
    }
  } catch (e) {
    if (e.error != 'no-speech') {
      console.error(e);
    }
    if (e.error === 'network') {
      face.update('confused');
      await respond({ text: "I'm experiencing network issues at the moment." })
    }
  }

};

el.onclick = conversationMode;
