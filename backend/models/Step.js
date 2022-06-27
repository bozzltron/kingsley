const MongoDB = require("../modules/Memory");

class Step {
  constructor(data) {
    Object.assign(this, data);
    this.type = "step";
  }
}

module.exports = Step;
