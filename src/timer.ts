import session from './session'
let timeout :any;
export default {

  start: ()=>{
    timeout = setTimeout(()=>{ 
      session.set({active: false});
    }, 30000)
    return timeout;
  },

  stop: ()=> {
    clearTimeout(timeout);
  }

}