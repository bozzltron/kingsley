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
require("dotenv").config();

// Kingsley Imports
const POS = require("./pos");
const Sentiment = require("./modules/Sentiment");
const logger = require("./modules/Logger");
const kbai = require("./modes/kbai");
const nlp = require("./modes/nlp");

// declare a new express app
const app = express();
app.use(bodyParser.json());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/****************************
 * Example post method *
 ****************************/

app.post("/inquire", async function (req, res) {
  try {
    let response = { text: "" };
    logger.info("New inquiry", req.body, "---------------------");

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
    logger.info("metadata", metadata);

    // req.body.mode = req.body.mode || "nlp";
    // switch (req.body.mode) {
    //   case "kbai":
    //     response = await kbai(req, res, metadata, statement);
    //     break;
    //   case "nlp":
    //     response = await nlp(req, res, metadata, statement);
    //     break;
    // }

    response = await kbai(req, res, metadata, statement);
    if (!response.text) {
      response = await nlp(req, res, metadata, statement);
    }
    console.log("response", response);
    res.json(response);
  } catch (e) {
    console.error(e);
    res.set({ status: 500 }).json({
      message: "Internal Server Error",
      error: e,
    });
  }
});

module.exports = app;
