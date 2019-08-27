const mongoose = require("mongoose");
const Joi = require("joi");
const { Country, countrySchema, validateCountry } = require("./country");

const recipeSchema = new mongoose.Schema({
  title: { type: String, min: 2, max: 255, required: true, trim: true },
  origin_country: countrySchema,
  author: { type: String, required: true },
  submitted_date: { type: Date, default: Date.now },
  last_edited: { type: Date, default: Date.now },
  likes: { type: Number, default: 1 },
  image_link: { type: String, default: "", trim: true },
  description: { type: String, default: "" },
  taste_profile: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: "A recipe should have at least 1 taste descriptor."
    }
  },
  ingredients: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 1;
      },
      message: "A recipe should have at least 2 ingredient."
    }
  },
  instructions: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: "A recipe should have at least 1 instruction."
    }
  }
});

const Recipe = mongoose.model("recipes", recipeSchema);

// Joi validation

function validateRecipe(recipe) {
  const schema = {
    title: Joi.string()
      .min(2)
      .max(255),
    origin_country_code: Joi.string()
      .max(2)
      .min(2),
    author: Joi.string(),
    likes: Joi.number().integer(),
    image_link: Joi.string(),
    description: Joi.string(),
    taste_profile: Joi.array().items(Joi.string()),
    ingredients: Joi.array().items(Joi.string()),
    instructions: Joi.array().items(Joi.string())
  };
  return Joi.validate(recipe, schema);
}

module.exports = { Recipe, recipeSchema, validateRecipe };
