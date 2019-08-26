const mongoose = require("mongoose");
const Joi = require("joi");

const Recipe = mongoose.model(
  "recipes",
  new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    origin_country: {
      name: { type: String, required: true },
      code: { type: String, required: true }
    },
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
  })
);

// Joi validation

function validateRecipe(recipe) {
  const schema = {
    title: Joi.string()
      .min(2)
      .max(50),
    origin_country: {
      name: Joi.string(),
      code: Joi.string()
    },
    author: Joi.string(),
    submitted_date: Joi.date(),
    last_edited: Joi.date(),
    likes: Joi.number().integer(),
    image_link: Joi.string(),
    description: Joi.string(),
    taste_profile: Joi.array().items(Joi.string()),
    ingredients: Joi.array().items(Joi.string()),
    instructions: Joi.array().items(Joi.string())
  };
  return Joi.validate(recipe, schema);
}
module.exports = { Recipe, validateRecipe };
