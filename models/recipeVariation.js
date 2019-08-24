const mongoose = require("mongoose");

const recipeVariationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  origin_country: { name: String, code: String },
  recipes: [
    {
      recipe: mongoose.ObjectId,
      recipe_data: {
        likes: Number,
        image_link: String
      }
    }
  ]
});

const RecipeVariation = mongoose.model(
  "recipe_variations",
  recipeVariationSchema
);

module.exports = RecipeVariation;
