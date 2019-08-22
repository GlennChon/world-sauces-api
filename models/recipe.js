const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
  imageLink: String,
  submittedBy: mongoose.ObjectId,
  submittedDate: { type: Date, default: Date.now },
  edited: [
    {
      editor: mongoose.ObjectId,
      editDate: { type: Date, default: Date.now }
    }
  ],
  originCountry: { name: String, code: String },
  description: String,
  tasteProfile: [String],
  ingredients: [
    {
      amount: String,
      measurement: String,
      ingredient: String
    }
  ],
  instructions: [String]
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
