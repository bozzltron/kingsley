const fetch = require("node-fetch");

async function run() {
  try {
    const input = process.argv[2];
    console.log("input", input);
    const env = process.argv[3] || "local";
    console.log("env", env);
    const server =
      env === "local"
        ? "http//:localhost:3012"
        : "https://kingsley-c4k5vxdlya-uc.a.run.app";
    let response = await fetch(`${server}/inquire`, {
      method: "post",
      body: JSON.stringify({ statement: input, confidence: 0.99 }),
      headers: { "Content-Type": "application/json" },
    });
    let json = await response.json();
    console.log(JSON.stringify(json));
  } catch (e) {
    console.log(e);
  }
}

run();
