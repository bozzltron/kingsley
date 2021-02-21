import session from './session'
let timeout :any;
export default {

  start: ()=>{
    session.set({active: true});
    timeout = setTimeout(()=>{ 
      session.set({active: false});
    }, 30000)
    return timeout;
  },

  stop: ()=> {
    clearTimeout(timeout);
  }

}