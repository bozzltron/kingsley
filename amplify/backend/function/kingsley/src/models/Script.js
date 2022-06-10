const Memory = require("../modules/Memory");
const Rules = require("../modules/Rules");
const Rule = require("./Rule");
const Actions = require("../modules/Actions");

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

  async perform_step(statement, metadata, step) {
    let response = { text: "" };
    if (!step) {
      step = this.steps[this.current_step];
    } else {
      console.log("step!", step);
    }

    switch (step.action) {
      case "speak":
        response = step.response;
        break;
      case "confirm":
        if (
          metadata.sentiment.vote != "negative" ||
          statement.includes("yes") ||
          !statement.includes("no")
        ) {
          step.selection = "yes";
          response = await this.perform_step(
            statement,
            metadata,
            step.options.yes
          );
          console.log("confirm yes response", response);
        } else {
          step.selection = "no";
          response = await this.perform_step(
            statement,
            metadata,
            step.options.no
          );
          console.log("confirm no response", response);
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
        console.log("verb", verb);
        let rules = await Rules.find(verb);
        console.log("existing rules", rules);
        if (rules.length > 0) {
          await new Rule(rules[0]).perform(statement, metadata);
        } else {
          let actions = await Actions.find({ verbs: verb });
          console.log("actions", actions);
          if (actions.length > 0) {
            let action = actions[0];
            await new Rule({
              statement: this.original_statement.replace("kingsley", ""),
              action: action.name,
              fn: action.fn ? action.fn : undefined,
              response: action.fn
                ? undefined
                : {
                    text: statement.split(verb)[1],
                  },
            }).create();
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
