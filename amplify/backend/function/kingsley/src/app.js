/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
// Amplify Imports
const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// Kingsley Imports
const POS = require("./pos");
const Sentiment = require("./modules/Sentiment");
const Conversations = require("./modules/Conversations");
const Rules = require("./modules/Rules");
const Scripts = require("./modules/Scripts");
const Script = require("./models/Script");
const no_rules_script = require("./models/data/script-no-action.json");
const Rule = require("./models/Rule");

// declare a new express app
const app = express();
app.use(bodyParser.json());
if (process.env.NODE_ENV == "production") {
  app.use(awsServerlessExpressMiddleware.eventContext());
}

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/****************************
 * Example post method *
 ****************************/

async function respond(res, statement, metadata, conversation, response) {
  await conversation.update({
    statement,
    metadata,
    response,
  });
  console.log("response", response);
  res.json(response);
}

app.post("/inquire", async function (req, res) {
  try {
    let response;
    console.log("body", req.body);

    if (!req.body.statement || !req.body.confidence) {
      return res.set({ status: 400 }).json({
        text: "",
        error: "statement, confidence, and conversation are required.",
      });
    }

    const statement = req.body.statement;
    const metadata = {
      confidence: req.body.confidence,
      conversation_id: req.body.conversation,
      sentiment: await Sentiment.analyze(statement),
      pos: await POS.getPOS(statement),
    };
    console.log("metadata", metadata);

    const conversation = await Conversations.findOrCreate(
      metadata.conversation_id
    );
    console.log("conversation", conversation);

    const active_scripts = await Scripts.find({ active: true });
    if (active_scripts.length > 0) {
      const active_script = active_scripts[0];
      console.log("active script", active_script);
      response = await new Script(active_script).perform_step(
        statement,
        metadata
      );
      return respond(res, statement, metadata, conversation, response);
    }

    // Reaction
    const rules = await Rules.search(statement);
    console.log("rules", rules);

    // Reason
    if (rules.length > 0) {
      console.log("rule", rules[0]);
      let response = await new Rule(rules[0]).perform(statement, metadata);
      return respond(res, statement, metadata, conversation, response);
    } else {
      console.log("activate the no rule script");
      let script = await Scripts.find({ scenario: "no rules" })[0];
      delete script._id;
      console.log("no rules script", script);
      let step = await new Script({
        ...script[0],
        original_statement: statement,
      }).activate();
      return respond(res, statement, metadata, conversation, step.response);
    }

    respond(res, statement, metadata, conversation, { text: "" });
  } catch (e) {
    console.error(e);
    res.set({ status: 500 }).json({
      message: "Internal Server Error",
      error: e,
    });
  }
});

app.listen(3000, function () {
  console.log("Kingsley started");
});

module.exports = app;
