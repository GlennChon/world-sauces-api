const mongoose = require("mongoose");
const Joi = require("joi");

const Country = mongoose.model(
  "countries",
  new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, min: 2, max: 2 }
  })
);
// Not needed but created for possibility of taste profile edits
function validateCountry(country) {
  const schema = {
    name: Joi.string().min(2),
    code: Joi.string()
      .min(2)
      .max(2)
  };

  return Joi.validate(tasteProfile, schema);
}

module.exports = { Country, validateCountry };
