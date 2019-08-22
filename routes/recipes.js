const express = require("express");
const router = express.Router();
const Joi = require("joi");

const recipes = require("../_tempData/recipes.json"); // temp

// RECIPES
// Get list of recipes
router.get("/", (req, res) => {
  res.send(recipes);
});

// Get recipe by id
router.get("/:id", (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe)
    return res.status(404).send("The recipe with given id was not found");
  res.send(recipe);
});

// Post new recipe
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe)
    return res.status(404).send("The recipe with given id was not found");

  const { error } = validateRecipe(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  recipe.name = req.body.name;
  res.send(recipe);
});

// Delete recipe by ID
router.delete("/:id", (req, res) => {
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

module.exports = router;
