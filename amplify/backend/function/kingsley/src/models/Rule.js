const Memory = require("../modules/Memory");
const search = require("../modules/Google");
const Util = require("../modules/Util");
class Rule {
  constructor(data) {
    Object.assign(
      this,
      {
        statement: "",
        action: "",
        response: {
          text: "",
        },
        type: "rule",
      },
      data
    );
  }
  async perform(statement, metadata) {
    if (!this.fn) {
      return this.response;
    } else if (this.fn == "search") {
      console.log("perform a search rule");
      return await search(statement);
    } else {
      return Util[this.fn]();
    }
  }
  create() {
    return Memory.create(this);
  }
}

module.exports = Rule;
