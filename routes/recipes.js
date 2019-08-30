const express = require("express");
const { Country } = require("../models/country");
const { TasteProfile } = require("../models/tasteProfile");
const { Recipe, validateRecipe } = require("../models/recipe");

const router = express.Router();
// RECIPES
// Get list of recipes
router.get("/", async (req, res) => {
  const pageNumber = 1;
  const pageSize = 24;
  const findProps = formatFindProps(req);
  const sortProps = formatSortProps(req);

  const recipes = await Recipe.find(findProps)
    // sort by likes desc
    .sort(sortProps)
    .select({
      _id: 1,
      title: 1,
      author: 1,
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

function formatSortProps(req) {
  const sort = req.query.sort;

  switch (sort) {
    case "title-asc":
      sortProps["title"] = 1;
      break;
    case "title-desc":
      sortProps["title"] = -1;
      break;
    case "author-asc":
      sortProps["author"] = 1;
      break;
    case "author-desc":
      sortProps["author"] = -1;
      break;
    case "likes-asc":
      sortProps["likes"] = 1;
      break;
    case "likes-desc":
      sortProps["likes"] = -1;
      break;
    case "country-asc":
      sortProps["origin_country.name"] = 1;
      break;
    case "country-desc":
      sortProps["origin_country.name"] = -1;
      break;
    default:
      sortProps["title"] = 1;
  }
  return sortProps;
}

function formatFindProps(req) {
  const countryCode = req.query.country; // country=US
  const searchValue = req.query.search; // search=search term
  const userName = req.query.author; // author=worldsauces
  // if countryCode query parameter exists search using country code
  if (countryCode) {
    const countryRegex = new RegExp("^" + countryCode + "$", "i");
    findProps["origin_country.code"] = countryRegex;
  }
  // if searchValue query parameter exists search using search term
  if (searchValue) {
    const searchRegex = new RegExp(searchValue, "i");
    findProps["title"] = searchRegex;
  }

  if (userName) {
    const userNameRegex = new RegExp(userName, "i");
    findProps["author"] = userNameRegex;
  }
  return findProps;
}

// Post new recipe
router.post("/", async (req, res) => {
  const { error } = validateRecipe(req.body.recipe);
  if (error) return res.status(400).send(error.details[0].message);

  // Find the country
  const country = await Country.findOne({
    code: req.body.origin_country_code.toUpperCase()
  });
  if (!country) return res.status(400).send("Invalid country.");

  // Find each tasteprofile, return id and name
  const tasteProfile = await TasteProfile.find({
    name: { $in: req.body.taste_profile }
  })
    .select({ _id: 1, name: 1 })
    .sort({ name: 1 });
  if (!tasteProfile) return res.status(400).send("No taste descriptors added.");

  const recipe = new Recipe({
    title: req.body.title,
    origin_country: {
      _id: country._id,
      name: country.name,
      code: country.code
    },
    author: req.body.author,
    submitted_date: Date.now(),
    last_edited: Date.now(),
    likes: req.body.likes,
    image_link: req.body.image_link,
    description: req.body.description,
    taste_profile: tasteProfile,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions
  });
  await recipe.save();
  res.send(recipe);
});

// Put Recipe by ID(update)
// Country, title, author, and submitted_date of original recipes should not be updated.
router.put("/:id", async (req, res) => {
  const { error } = validateRecipe(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Find each tasteprofile, return id and name
  const tasteProfile = await TasteProfile.find({
    name: { $in: req.body.taste_profile }
  })
    .select({ _id: 1, name: 1 })
    .sort({ name: 1 });
  if (!tasteProfile) return res.status(400).send("No taste descriptors added.");

  // Update the recipe by ID
  const recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    {
      last_edited: Date.now(),
      likes: req.body.likes,
      image_link: req.body.image_link,
      description: req.body.description,
      taste_profile: tasteProfile,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions
    },
    { new: true }
  );
  if (!recipe)
    return res.status(404).send("The recipe with given id was not found");

  res.send(recipe);
});

// Delete recipe by ID (just here for administrative purposes.)
router.delete("/:id", async (req, res) => {
  const recipe = await Recipe.findByIdAndRemove(req.params.id);
  if (!recipe)
    return res.status(404).send("The recipe with given id was not found");
  res.send(recipe);
});

module.exports = router;
