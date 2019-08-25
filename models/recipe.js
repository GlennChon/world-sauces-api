const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  origin_country: { name: String, code: String },
  author: { type: String, required: true },
  submitted_date: { type: Date, default: Date.now },
  last_edited: { type: Date, default: Date.now },
  likes: { type: Number, default: 1 },
  image_link: { type: String, default: "" },
  description: String,
  taste_profile: [{ type: String, default: "" }],
  ingredients: [String],
  instructions: [String]
});

const Recipe = mongoose.model("recipes", recipeSchema);

module.exports = Recipe;
