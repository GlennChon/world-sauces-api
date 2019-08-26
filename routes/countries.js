const express = require("express");
const router = express.Router();

const { Country, validateCountry } = require("../models/country");
const { Recipe, validateRecipe } = require("../models/recipe");
// COUNTRIES
// Get list of countries
router.get("/", async (req, res) => {
  const countries = await Country.find().select({ _id: 0, name: 1, code: 1 });
  res.send(countries);
});

module.exports = router;
