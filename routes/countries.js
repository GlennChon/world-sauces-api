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

// Get recipes by country
router.get("/:code", async (req, res) => {
  const pageNumber = 1;
  const pageSize = 24;
  try {
    const countryRecipes = await Recipe.find({
      "origin_country.code": req.params.code.toUpperCase().toString()
    })
      .sort({ likes: -1 })
      .select({
        _id: 1,
        title: 1,
        taste_profile: 1,
        origin_country: 1,
        image_link: 1,
        likes: 1
      })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    if (!countryRecipes) return res.status(404).send("No such country");
    res.send(countryRecipes);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
