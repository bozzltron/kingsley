const Memory = require("../modules/Memory");
const Action = require("../models/Action");
const Actions = {
  find: (query) => {
    return Memory.find(Object.assign({ type: "action" }, query));
  },
};

module.exports = Actions;
