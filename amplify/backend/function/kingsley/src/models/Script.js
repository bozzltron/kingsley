const Memory = require("../modules/Memory");
const Rules = require("../modules/Rules");
const Rule = require("./Rule");
const Actions = require("../modules/Actions");
const logger = require("../modules/Logger");
class Script {
  constructor(data) {
    Object.assign(
      this,
      {
        scenario: "",
        current_step: 0,
        steps: [],
      },
      data,
      { type: "script" }
    );
  }

  async activate() {
    this.active = true;
    await Memory.create(this);
    return this.next_step();
  }

  hasConfirmed(statement, metadata) {
    let decision = false;
    if (statement.includes("yes") || metadata.sentiment.score > 0) {
      decision = true;
    }
    return true;
  }

  async perform_step(statement, metadata, step) {
    let response = { text: "" };
    if (!step) {
      step = this.steps[this.current_step];
    } else {
      logger.info("step!", step);
    }

    switch (step.action) {
      case "navigate":
        this.current_step = step.step;
        response = this.perform_step(
          statement,
          metadata,
          this.steps[step.step]
        );
        break;
      case "speak":
        response = step.response;
        break;
      case "confirm":
        if (this.hasConfirmed(statement, metadata)) {
          step.selection = "yes";
          response = await this.perform_step(
            statement,
            metadata,
            step.options.yes
          );
          logger.info("confirm yes response", response);
        } else {
          step.selection = "no";
          response = await this.perform_step(
            statement,
            metadata,
            step.options.no
          );
          logger.info("confirm no response", response);
          if (step.session == "end") {
            await this.delete();
          }
        }
        break;
      case "create_rule":
        if (metadata.pos.verbs.length == 0) {
          response = { text: "I don't understand. Try again" };
        }
        let verb = metadata.pos.verbs[0];
        logger.info("verb", verb);
        let rules = await Rules.find(verb);
        logger.info("existing rules", rules);
        if (rules.length > 0) {
          await new Rule(rules[0]).perform(statement, metadata);
        } else {
          let actions = await Actions.find({ verbs: verb });
          logger.info("actions", actions);
          if (actions.length > 0) {
            let action = actions[0];
            let rule = await new Rule({
              statement: this.original_statement.replace("kingsley", ""),
              action: action.name,
              fn: action.fn ? action.fn : undefined,
              response: action.fn
                ? undefined
                : {
                    text: statement.split(verb)[1],
                  },
            }).create();
            step.rule = rule;
            response = {
              text: `So I should perform the ${action.name} action when you say: ${this.original_statement}?`,
            };
          } else {
            // TODO : save action ideas
            response = {
              text: "I'm sorry, I am not capable of that action, but I will add it to my list of features.",
            };
          }
        }
    }
    await this.next_step();
    return response;
  }

  async next_step() {
    let step = this.steps[this.current_step];
    this.current_step = this.current_step + 1;
    if (this.current_step >= this.steps.length) {
      await this.delete();
    } else {
      await this.update();
    }
    return step;
  }

  update() {
    return Memory.updateOne({ _id: this._id }, this);
  }

  delete() {
    return Memory.deleteOne({ _id: this._id });
  }
}

module.exports = Script;
