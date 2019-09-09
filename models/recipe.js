const Joi = require("joi");
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, min: 2, max: 255, required: true, trim: true },
  origin_country: { type: String, required: true },
  author: { type: String, required: true },
  submitted_date: { type: Date, default: Date.now },
  last_edited: { type: Date, default: Date.now },
  likes: { type: Number, default: 1 },
  image_link: { type: String, default: "", trim: true },
  description: { type: String, default: "" },
  taste_profile: { type: Array },
  ingredients: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: "A recipe should have at least 1 ingredient."
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
      .max(255)
      .required(),
    origin_country: Joi.string()
      .min(2)
      .max(50)
      .required(),
    author: Joi.string().required(),
    likes: Joi.number().integer(),
    image_link: Joi.string(),
    description: Joi.string(),
    taste_profile: Joi.array()
      .items(Joi.string())
      .min(1),
    ingredients: Joi.array().items(
      Joi.object()
        .keys({
          value: Joi.string().min(3)
        })
        .min(1)
    ),
    instructions: Joi.array().items(
      Joi.object()
        .keys({
          value: Joi.string().min(3)
        })
        .min(1)
    )
  };
  return Joi.validate(recipe, schema);
}

module.exports = { Recipe, recipeSchema, validateRecipe };
