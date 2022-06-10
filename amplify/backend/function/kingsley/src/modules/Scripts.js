const Memory = require("../modules/Memory");
const Script = require("../models/Script");
const Scripts = {
  load: async () => {},
  find: async (options) => {
    return await Memory.find(Object.assign({ type: "script" }, options));
  },
};

module.exports = Scripts;
