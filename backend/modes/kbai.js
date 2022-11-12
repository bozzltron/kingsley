const Conversations = require("../modules/Conversations");
const Rules = require("../modules/Rules");
const Scripts = require("../modules/Scripts");
const Script = require("../models/Script");
const Rule = require("../models/Rule");
const logger = require("../modules/Logger");

async function kbai(req, res, metadata, statement) {
  console.log("kbai");
  const conversation = await Conversations.findOrCreate(
    metadata.conversation_id
  );
  logger.info("conversation", conversation);

  const active_scripts = await Scripts.find({ active: true });
  if (active_scripts.length > 0) {
    const active_script = active_scripts[0];
    logger.info("active script", active_script);
    response = await new Script(active_script).perform_step(
      statement,
      metadata
    );

    await conversation.update({
      statement,
      metadata,
      response,
    });

    return response;
  }

  // Reaction
  const rules = await Rules.search(statement);
  logger.info("rules", rules);

  // Reason
  if (rules.length > 0) {
    logger.info("rule", rules[0]);

    let response = await new Rule(rules[0]).perform(statement, metadata);

    await conversation.update({
      statement,
      metadata,
      response,
    });

    return response;
  } else {
    // logger.info("activate the no rule script");
    // let scripts = await Scripts.find({ scenario: "no rules" });
    // if (scripts.length > 0) {
    //   let script = scripts[0];
    //   if (script._id) delete script._id;
    //   logger.info("no rules script", script);
    //   let step = await new Script({
    //     ...script,
    //     original_statement: statement,
    //   }).activate();

    // let response = await new Rule({
    //   type: "rule",
    //   statement: statement,
    //   action: "search",
    //   fn: "search",
    // }).perform(statement, metadata);

    // await conversation.update({
    //   statement,
    //   metadata,
    //   response,
    // });

    return { text: "" };
  }
}

module.exports = kbai;
