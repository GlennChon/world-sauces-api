const mongoose = require("mongoose");

const recipeVariationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  originCountry: { name: String, code: String },
  recipes: [
    {
      recipe: {
        ref: "recipes",
        id: mongoose.ObjectId
      },
      recipe_data: {
        likes: Number,
        image_link: String
      }
    }
  ]
});

const RecipeVariation = mongoose.model(
  "RecipeVariation",
  recipeVariationSchema
);

module.exports = RecipeVariation;
