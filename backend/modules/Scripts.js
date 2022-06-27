const Memory = require("../modules/Memory");
const Scripts = {
  find: (options) => {
    return Memory.find({
      $and: [{ type: "script" }, options],
    });
  },
};

module.exports = Scripts;
