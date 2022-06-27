const app = require("../../app");
const Rules = require("../../modules/Rules");
const Rule = require("../../models/Rule");
const request = require("supertest");
const Conversations = require("../../modules/Conversations");
const Conversation = require("../Conversation");
const Scripts = require("../../modules/Scripts");
const noRulesScript = require("../data/script-no-action.json");
const Memory = require("../../modules/Memory");
const Script = require("../../models/Script");
const Actions = require("../../modules/Actions");

jest.setTimeout(60000);

describe("No rules script", () => {
  it("step 1: should activate the no rules script", async () => {
    let conversation = new Conversation({ id: "no-rules-test" });
    Conversations.findOrCreate = jest.fn(() => Promise.resolve(conversation));
    Rules.find = jest.fn().mockResolvedValueOnce([]);
    Scripts.find = jest
      .fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([noRulesScript]);
    Rules.search = jest.fn(() => Promise.resolve([]));
    Memory.create = jest.fn(() => Promise.resolve());
    Script.prototype.update = jest.fn(() => Promise.resolve());
    Conversation.prototype.update = jest.fn(() => Promise.resolve());

    await request(app)
      .post("/inquire")
      .send({
        statement: "what's the weather",
        confidence: 0.99,
        conversation: "test-convo",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        console.log("response", response.body);
        expect(response.body).toEqual({
          text: "I don't know what to do. Can you teach me?",
        });
      });
  });

  it("step 2 : should recieve confirmation", async () => {
    let conversation = new Conversation({ id: "no-rules-test" });
    Conversations.findOrCreate = jest.fn(() => Promise.resolve(conversation));
    Rules.find = jest.fn().mockResolvedValueOnce([]);
    Scripts.find = jest
      .fn()
      .mockResolvedValueOnce([
        Object.assign({}, noRulesScript, { current_step: 1 }),
      ]);
    //Rules.search = jest.fn(() => Promise.resolve([]));
    //Memory.create = jest.fn(() => Promise.resolve());
    Script.prototype.update = jest.fn(() => Promise.resolve());
    Conversation.prototype.update = jest.fn(() => Promise.resolve());

    await request(app)
      .post("/inquire")
      .send({
        statement: "yes",
        confidence: 0.99,
        conversation: "test-convo",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        console.log("response", response.body);
        expect(response.body).toEqual({
          text: "Ok. What do I do?",
        });
      });
  });

  it("step 3 : should repeat back", async () => {
    let conversation = new Conversation({ id: "no-rules-test" });
    Conversations.findOrCreate = jest.fn(() => Promise.resolve(conversation));
    Rules.find = jest.fn().mockResolvedValueOnce([]);
    Scripts.find = jest.fn().mockResolvedValueOnce([
      Object.assign({}, noRulesScript, {
        current_step: 2,
        original_statement: "what's the weather",
      }),
    ]);
    //Rules.search = jest.fn(() => Promise.resolve([]));
    //Memory.create = jest.fn(() => Promise.resolve());
    Script.prototype.update = jest.fn(() => Promise.resolve());
    Conversation.prototype.update = jest.fn(() => Promise.resolve());
    Rule.prototype.create = jest.fn(() => Promise.resolve());
    Actions.find = jest.fn(() =>
      Promise.resolve([
        {
          type: "action",
          name: "search",
          fn: "search",
          verbs: ["search", "find", "looking"],
        },
      ])
    );

    await request(app)
      .post("/inquire")
      .send({
        statement: "search for the weather in Colorado Springs",
        confidence: 0.99,
        conversation: "test-convo",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        console.log("response", response.body);
        expect(response.body).toEqual({
          text: "So I should perform the search action when you say: what's the weather?",
        });
      });
  });
});
