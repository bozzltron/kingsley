const Memory = require("../modules/Memory");
const Actions = {
  find: (options) => {
    return Memory.find({
      $and: [{ type: "action" }, options],
    });
  },
};

module.exports = Actions;
