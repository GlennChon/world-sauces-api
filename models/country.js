const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: { type: String, min: 2, max: 255 },
  code: { type: String, min: 2, max: 2, uppercase: true }
});

const Country = mongoose.model("countries", countrySchema);
// Not needed but created for possibility of taste profile edits
async function validateCountry(country) {
  const schema = {
    name: Joi.string().min(2),
    code: Joi.string()
      .min(2)
      .max(2)
  };
  return await schema.validate(country);
}

module.exports = { Country, countrySchema, validateCountry };
