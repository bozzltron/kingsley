const Memory = require("../modules/Memory");
const Conversation = require("../models/Conversation");
const Conversations = {
  findOrCreate: async (id) => {
    const conversations = await Memory.find({ type: "conversation", id });
    if (conversations.length == 0) {
      let convo = await Memory.create(new Conversation({ id }));
      return new Conversation(convo);
    } else {
      return new Conversation(conversations[0]);
    }
  },
};

module.exports = Conversations;
