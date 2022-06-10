const Memory = require("../modules/Memory");
const Conversation = require("../models/Conversation");
const Conversations = {
  findOrCreate: async (id) => {
    const conversations = await Memory.find({ type: "conversation", id });
    console.log("findOrCreate conversations", conversations);
    if (conversations.length == 0) {
      let convo = await Memory.create(new Conversation({ id }));
      console.log("creating conversation", convo);
      return new Conversation(convo);
    } else {
      console.log("found converstations", conversations);
      return new Conversation(conversations[0]);
    }
  },
};

module.exports = Conversations;
