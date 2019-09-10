const morgan = require("morgan");
const config = require("config");
const express = require("express");
const winston = require("winston");

const app = express();

// Startup
winston.info("Application Name: " + config.get("name"));

if (app.get("env") === "development") {
  app.use(morgan("tiny")); // logger middleware
  winston.info("Morgan enabled...");
}

require("./startup/db")();
require("./startup/routes")(app);
// require("./startup/logging")();
// require("./startup/cors")(app);
// require("./startup/config")();
// require("./startup/validation")();

// TODO: make mail server connection for sending confirmation mail
// console.log("Mail Server: " + config.get("mail.host"));
// console.log("Mail Password: " + config.get("mail.password"));

// Port
const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);
module.exports = server;
