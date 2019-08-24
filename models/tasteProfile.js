const mongoose = require("mongoose");

const tasteProfileSchema = new mongoose.Schema({
  name: String,
  desc: String,
  eg: String
});

const TasteProfile = mongoose.model("TasteProfile", tasteProfileSchema);

module.exports = TasteProfile;
