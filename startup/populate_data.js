const assert = require("assert");

const countries = require("../data/countries.json");
const tasteProfiles = require("../data/tasteProfiles.json");
const recipes = require("../data/recipes.json");
const { Country } = require("../models/country");
const { TasteProfile } = require("../models/tasteProfile");
const { Recipe } = require("../models/recipe");

module.exports = async function() {
  const countryCount = await Country.countDocuments();
  if (countryCount < 1) {
    importData(Country, countries);
  }

  const tprofileCount = await TasteProfile.countDocuments();
  if (tprofileCount < 1) {
    importData(TasteProfile, tasteProfiles);
  }

  const recipeCount = await Recipe.countDocuments();
  if (recipeCount < 1) {
    importData(Recipe, recipes);
  }
};

async function importData(model, data) {
  await model.collection.insertMany(data);
}
