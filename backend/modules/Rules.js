const Memory = require("../modules/Memory");
const Rule = require("../models/Rule");
const Rules = {
  find: (options) => {
    return Memory.find({
      $and: [{ type: "rule" }, options],
    });
  },
  search: (statement) => {
    return Memory.search(statement);
  },
};

module.exports = Rules;
