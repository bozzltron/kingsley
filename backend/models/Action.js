const Memory = require("../modules/Memory");

class Action {
  constructor(data) {
    Object.assign(this, data, { type: "action" });
  }
}

module.exports = Action;
