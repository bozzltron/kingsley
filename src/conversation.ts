
const Conversation = {
  get: () => {
    return localStorage.getItem('conversation') || "";
  },
  add: (message:string) => {
    let conversation = Conversation.get();
    conversation += message;
    localStorage.setItem('conversation', conversation);
  },
}

export {Conversation};


