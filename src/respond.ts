import session from './session'
import { Response } from './interfaces'
import face from './face'
import speak from './speak'
import messages from './messages'

export default function respond(response: Response) {
    console.log("response", response);
    if (!response) return Promise.resolve();
    response.speak = response.speak !== false;
    
    if (session.get().active) {
      
        if (response.text === "") {
        face.update('disappointed');
        //response.text = "Try again."
      } else {
        face.update('open_mouth');
      }
      
      if (response.meta) {
        session.set({ meta: response.meta });
      }
      
      messages.create(Object.assign({}, response, { text: "Response: " + response.text, url: response.url }));
      return response.speak ? speak(response.text) : Promise.resolve();
    } else {
      messages.create({ text: `Saying "${session.get().name}" will wake me up.` });
      return Promise.resolve();
    }
  }