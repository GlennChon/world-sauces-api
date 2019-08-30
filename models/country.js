const mongoose = require("mongoose");
const Joi = require("joi");

const countrySchema = new mongoose.Schema({
  name: { type: String, min: 2, max: 255 },
  code: { type: String, min: 2, max: 2, uppercase: true }
});

const Country = mongoose.model("countries", countrySchema);
// Not needed but created for possibility of taste profile edits
function validateCountry(country) {
  const schema = {
    name: Joi.string().min(2),
    code: Joi.string()
      .min(2)
      .max(2)
  };
  return Joi.validate(country, schema);
}

module.exports = { Country, countrySchema, validateCountry };
