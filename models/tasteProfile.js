const mongoose = require("mongoose");
const Joi = require("joi");

const TasteProfile = mongoose.model(
  "taste_profiles",
  new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    eg: { type: String, required: true }
  })
);

// Not needed but created for possibility of taste profile edits
function validateTasteProfile(tasteProfile) {
  const schema = {
    name: Joi.string(),
    desc: Joi.string(),
    eg: Joi.string()
  };

  return Joi.validate(tasteProfile, schema);
}

module.exports = { TasteProfile, validateTasteProfile };
