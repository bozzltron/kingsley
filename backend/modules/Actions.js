const Memory = require("../modules/Memory");
const Action = require("../models/Action");
const Actions = {
  find: (options) => {
    return Memory.find({
      $and: [{ type: "action" }, options],
    });
  },
};

module.exports = Actions;
