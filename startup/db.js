const mongoose = require("mongoose");
const config = require("config");

// Mongo Connection handler
module.exports = function() {
  const db = config.get("db", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
  mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
};
