const express = require("express");
const router = express.Router();
const Joi = require("joi");

const countries = require("../_tempData/countries.json"); // temp

// COUNTRIES
// Get list of countries
router.get("/", (req, res) => {
  res.send(countries);
});

// Get recipes by country
router.get("/:code", (req, res) => {
  const countryRecipes = recipes.filter(
    r => r.originCountry.code === req.params.code.toUpperCase()
  );
  if (!countryRecipes) return res.status(404).send("No such country");
  res.send(countryRecipes);
});

module.exports = router;
