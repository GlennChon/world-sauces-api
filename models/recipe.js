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
  ingredients: [
    {
      amount: { type: String, required: true },
      measurement: { type: String, required: true },
      ingredient: { type: String, required: true }
    }
  ],
  instructions: [String]
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
