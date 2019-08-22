const express = require("express");
const http = require("http");
const _ = require("underscore");

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
  if (!countryRecipes) res.status(404).send("No such country");
  res.send(countryRecipes);
});

// Get list of taste profiles
app.get("/api/tasteprofiles", (req, res) => {
  res.send(tasteProfiles);
});

// Get list of recipes
app.get("/api/recipes", (req, res) => {
  log("Sending all recipes");
  res.send(recipes);
});

// Get recipe by id
app.get("/api/recipes/:id", (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) res.status(404).send("The recipe with given id was not found");
  res.send(recipe);
});

app.post("/api/recipes", (req, res) => {
  const recipe = {
    id: recipes.length + 1
  };
});

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => log(`Listening on port ${port}`));
// app.post();
// app.put();
// app.delete();
