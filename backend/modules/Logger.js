const bunyan = require("bunyan");
const { LoggingBunyan } = require("@google-cloud/logging-bunyan");

// Setup from https://cloud.google.com/logging/docs/setup/nodejs

function LocalStream() {}
LocalStream.prototype.write = function (rec) {
  console.log(
    "[%s] %s: %s",
    rec.time.toISOString(),
    bunyan.nameFromLevel[rec.level],
    rec.msg
  );
};

let streams = [];

if (process.env.NODE_ENV === "production") {
  const loggingBunyan = new LoggingBunyan();
  // streams.push({
  //   stream: process.stdout, level: 'info'
  // });
  streams.push(loggingBunyan.stream("info"));
} else {
  streams.push({
    level: "info",
    stream: new LocalStream(),
    type: "raw",
  });
}

const logger = bunyan.createLogger({
  name: "notification-service",
  streams: streams,
});

module.exports = logger;
