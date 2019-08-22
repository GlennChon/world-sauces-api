const mongoose = require("mongoose");

const tasteProfileSchema = new mongoose.Schema({
  name: String,
  desc: String,
  eg: String
});

module.exports = tasteProfileSchema;
