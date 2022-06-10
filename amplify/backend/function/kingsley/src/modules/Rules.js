const Memory = require("../modules/Memory");
const Rule = require("../models/Rule");
const Rules = {
  find: (statement) => {
    return Memory.find({ type: "rule", statement });
  },
  search: (statement) => {
    return Memory.search(statement);
  },
};

module.exports = Rules;
