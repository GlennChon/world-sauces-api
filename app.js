const express = require("express");
const http = require("http");
const _ = require("underscore");
const Joi = require("joi");

const log = require("./logger");

const recipes = require("./_tempData/recipes.json");
const countries = require("./_tempData/countries.json");
const tasteProfiles = require("./_tempData/tasteProfiles.json");
const app = express();

app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.send("World Sauces Home");
});

// COUNTRIES
// Get list of countries
app.get("/api/countries", (req, res) => {
  log("Sending list of countries");
  res.send(countries);
});

// Get recipes by country
app.get("/api/countries/:code", (req, res) => {
  const countryRecipes = recipes.filter(
    r => r.originCountry.code === req.params.code.toUpperCase()
  );
  if (!countryRecipes) return res.status(404).send("No such country");
  res.send(countryRecipes);
});

// TASTE PROFILES
// Get list of taste profiles
app.get("/api/tasteprofiles", (req, res) => {
  res.send(tasteProfiles);
});

// RECIPES
// Get list of recipes
app.get("/api/recipes", (req, res) => {
  log("Sending all recipes");
  res.send(recipes);
});

// Get recipe by id
app.get("/api/recipes/:id", (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe)
    return res.status(404).send("The recipe with given id was not found");
  res.send(recipe);
});

// Post new recipe
app.post("/api/recipes", (req, res) => {
  const { error } = validateRecipe(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const recipe = {
    id: recipes.length + 1,
    name: req.body.name
  };
  recipes.push(recipe);
  res.send(recipe);
});

// Put Recipe by ID(update);
app.put("/api/recipes/:id", (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe)
    return res.status(404).send("The recipe with given id was not found");

  const { error } = validateRecipe(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  recipe.name = req.body.name;
  res.send(recipe);
});

// Delete recipe by ID
app.delete("/api/recipes/:id", (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe)
    return res.status(404).send("The recipe with given id was not found");

  const index = recipes.indexOf(recipe);
  recipes.splice(index, 1);

  res.send(recipe);
});

function validateRecipe(recipe) {
  const schema = {
    name: Joi.string()
      .min(2)
      .required()
  };

  return Joi.validate(recipe, schema);
}

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => log(`Listening on port ${port}`));
