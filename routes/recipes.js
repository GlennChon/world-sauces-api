const express = require("express");
const router = express.Router();

const { Recipe, validateRecipe } = require("../models/recipe");

// RECIPES
// Get list of recipes
router.get("/", async (req, res) => {
  const pageNumber = 1;
  const pageSize = 24;
  let findProperties = {};
  const countryCode = req.query.country;
  const searchValue = req.query.search;

  // if countryCode query parameter exists search using country code
  if (countryCode) {
    const countryRegex = new RegExp("^" + countryCode.toUpperCase() + "$", "i");
    findProperties["origin_country.code"] = countryRegex;
  }
  // if searchValue query parameter exists search using search term
  if (searchValue) {
    const searchRegex = new RegExp(searchValue, "i");
    findProperties["title"] = searchRegex;
  }

  const recipes = await Recipe.find(findProperties)
    // sort by likes desc
    .sort({ likes: -1 })
    .select({
      _id: 1,
      title: 1,
      taste_profile: 1,
      origin_country: 1,
      image_link: 1,
      likes: 1
    })
    //pagination
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
  res.send(recipes);
});

// Get recipe by id
router.get("/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe)
    return res.status(404).send("The recipe with given id was not found");
  res.send(recipe);
});

// Post new recipe
router.post("/", async (req, res) => {
  const { error } = validateRecipe(req.body.recipe);
  if (error) return res.status(400).send(error.details[0].message);
  let recipe = new Recipe({
    title: req.body.title,
    origin_country: req.body.origin_country,
    author: req.body.author,
    submitted_date: Date.now(),
    last_edited: Date.now(),
    likes: req.body.likes,
    image_link: req.body.image_link,
    description: req.body.description,
    taste_profile: req.body.taste_profile,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions
  });
  recipe = await recipe.save();
  res.send(recipe);
});

// Put Recipe by ID(update);
router.put("/:id", async (req, res) => {
  const { error } = validateRecipe(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      origin_country: req.body.origin_country,
      author: req.body.author,
      last_edited: Date.now(),
      likes: req.body.likes,
      image_link: req.body.image_link,
      description: req.body.description,
      taste_profile: req.body.taste_profile,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions
    },
    { new: true }
  );
  if (!recipe)
    return res.status(404).send("The recipe with given id was not found");

  res.send(recipe);
});

// Delete recipe by ID
router.delete("/:id", async (req, res) => {
  const recipe = await Recipes.findByIdAndRemove(req.params.id);
  if (!recipe)
    return res.status(404).send("The recipe with given id was not found");

  res.send(recipe);
});

module.exports = router;

// Increment Recipe Like Count
incrementRecipeLikes = async recipe => {
  return recipe.updateOne({ $inc: { likes: 1 } });
};

// Decerement Recipe Like Count
decrementRecipeLikes = async recipe => {
  return recipe.updateOne({ $inc: { likes: -1 } });
};
