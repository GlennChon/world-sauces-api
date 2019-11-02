const auth = require("../middleware/auth");
const express = require("express");
const { Recipe, validateRecipe } = require("../models/recipe");

const router = express.Router();
// RECIPES
// Get list of recipes
router.get("/", async (req, res) => {
  const pageNumber = req.query.page ? parseInt(req.query.page) : 1;
  const pageSize = req.query.size ? parseInt(req.query.size) : 30;
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

// get recipes based on array
router.post("/likes", async (req, res) => {
  const pageNumber = req.query.page ? parseInt(req.query.page) : 1;
  const pageSize = req.query.size ? parseInt(req.query.size) : 30;
  const recipes = await Recipe.find({
    _id: { $in: req.body.likes }
  })
    .sort({ title: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
  res.send(recipes);
});

router.get("/random", async (req, res) => {
  const pageSize = req.query.size ? parseInt(req.query.size) : 3;
  const recipes = await Recipe.aggregate([{ $sample: { size: pageSize } }]);
  res.send(recipes);
});

router.get("/popular", async (req, res) => {
  const pageSize = req.query.size ? parseInt(req.query.size) : 3;
  const recipes = await Recipe.find()
    // sort by likes desc
    .sort({ likes: -1 })
    .select({
      _id: 1,
      title: 1,
      author: 1,
      taste_profile: 1,
      origin_country: 1,
      image_link: 1,
      likes: 1
    })
    .limit(pageSize);
  res.send(recipes);
});

// Get recipe by id
router.get("/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).select("-__v");
  if (!recipe)
    return res.status(404).send("The recipe with given id was not found");
  res.send(recipe);
});

function formatSortProps(req) {
  const sort = req.query.sort;
  let sortProps = {};
  switch (sort) {
    case "title-asc":
      sortProps.title = 1;
      break;
    case "title-desc":
      sortProps.title = -1;
      break;
    case "author-asc":
      sortProps.author = 1;
      break;
    case "author-desc":
      sortProps.author = -1;
      break;
    case "likes-asc":
      sortProps.likes = 1;
      break;
    case "likes-desc":
      sortProps.likes = -1;
      break;
    case "country-asc":
      sortProps["origin_country.name"] = 1;
      break;
    case "country-desc":
      sortProps["origin_country.name"] = -1;
      break;
    default:
      sortProps.title = 1;
  }
  return sortProps;
}

function formatFindProps(req) {
  const countryName = req.query.country; // country=US
  const searchValue = req.query.search; // search=search term
  const userName = req.query.author; // author=worldsauces
  let findProps = {};
  // if searchValue query parameter exists search using search term
  if (searchValue) {
    const searchRegex = new RegExp(searchValue, "i");
    findProps.title = searchRegex;
  }
  // if countryCode query parameter exists search using country name
  if (countryName) {
    coutryName = countryName.replace("%20", " ");
    const countryRegex = new RegExp("^" + countryName + "$", "i");
    findProps["origin_country"] = countryRegex;
  }
  if (userName) {
    const userNameRegex = new RegExp(userName, "i");
    findProps.author = userNameRegex;
  }
  return findProps;
}

// Post new recipe
router.post("/", auth, async (req, res) => {
  const { error } = validateRecipe(req.body.recipe);
  if (error) return res.status(400).send(error.details[0].message);

  const recipe = new Recipe({
    title: req.body.title,
    origin_country: req.body.origin_country,
    author: req.body.author,
    yield: req.body.yield,
    sauce_type: req.body.sauce_type,
    good_for: req.body.good_for,
    gluten_free: req.body.gluten_free,
    dairy_free: req.body.dairy_free,
    submitted_date: Date.now(),
    last_edited: Date.now(),
    likes: req.body.likes,
    image_link: req.body.image_link,
    description: req.body.description,
    taste_profile: req.body.taste_profile,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions
  });
  await recipe.save();
  res.send(recipe);
});

// Put Recipe by ID(update)
// Country, author, likes, and submitted_date of original recipes should not be updated here
router.put("/:id", auth, async (req, res) => {
  const { error } = validateRecipe(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (!req.body.taste_profile)
    return res.status(400).send("No taste descriptors added.");

  // Update the recipe by ID
  const recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      last_edited: Date.now(),
      image_link: req.body.image_link,
      description: req.body.description,
      yield: req.body.yield,
      sauce_type: req.body.sauce_type,
      good_for: req.body.good_for,
      gluten_free: req.body.gluten_free,
      dairy_free: req.body.dairy_free,
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

// Increment like for specific recipe
router.put("/like", auth, async (req, res) => {
  Recipe.updateOne({ _id: req.body._id }, { $inc: { likes: 1 } });
});

// Decrement like for specific recipe
router.put("/unlike", auth, async (req, res) => {
  Recipe.updateOne({ _id: req.body._id }, { $inc: { likes: -1 } });
});

// Delete recipe by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndRemove(req.params.id);
    // does not remove from each user's like list
    if (!recipe) {
      return res.status(404).send("The recipe with given id was not found");
    }
    res.send(recipe);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

module.exports = router;
