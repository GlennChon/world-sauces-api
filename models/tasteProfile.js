const mongoose = require("mongoose");
const Joi = require("joi");

const tasteProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  eg: { type: String, required: true }
});

const TasteProfile = mongoose.model("taste_profiles", tasteProfileSchema);

function validateTasteProfile(tasteProfile) {
  const schema = {
    name: Joi.string(),
    desc: Joi.string(),
    eg: Joi.string()
  };

  return Joi.validate(tasteProfile, schema);
}

module.exports = { TasteProfile, tasteProfileSchema, validateTasteProfile };
