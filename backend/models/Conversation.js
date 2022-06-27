const Memory = require("../modules/Memory");

class Conversation {
  constructor(data) {
    this.id = data.id;
    this.steps = data.steps || [];
    this.date = new Date();
    this.person = "person";
    this.type = "conversation";
  }

  async update(step) {
    this.steps.push(step);
    return Memory.updateOne({ id: this.id }, this);
  }
}

module.exports = Conversation;
