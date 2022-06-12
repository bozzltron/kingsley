const lb = require("@google-cloud/logging-bunyan");
const app = require("./app");

async function startServer() {
  if (process.env.NODE_ENV == "production") {
    const { logger, mw } = await lb.express.middleware({
      logName: "kingsley",
    });
  }

  // Install the logging middleware. This ensures that a Bunyan-style `log`
  // function is available on the `request` object. This should be the very
  // first middleware you attach to your app.
  app.use(mw);

  app.listen(process.env.PORT, () => {
    console.log(`Kingsley listening on port ${process.env.PORT}`);
  });
}

startServer();
