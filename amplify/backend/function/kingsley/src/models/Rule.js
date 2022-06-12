const Memory = require("../modules/Memory");
const search = require("../modules/Google");
const news = require("../modules/News");
const Util = require("../modules/Util");
const logger = require("../modules/Logger");
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
      logger.info("perform a search rule");
      return await search(statement);
    } else if (this.fn == "news") {
      logger.info("perform a news rule");
      return await news(statement);
    } else {
      return Util[this.fn](statement, metadata);
    }
  }
  create() {
    return Memory.create(this);
  }
}

module.exports = Rule;
