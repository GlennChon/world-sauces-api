const config = require("config");
const winston = require("winston");
const mongoose = require("mongoose");
// Mongo Connection handler
module.exports = function() {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
    .then(() => winston.info(`Connected to ${db}...`));
};
