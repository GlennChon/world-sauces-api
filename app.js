const express = require("express");
const _ = require("underscore");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const mongoose = require("mongoose");

// Routes
const homeRoute = require("./routes/home");
const recipesRoute = require("./routes/recipes");
const countriesRoute = require("./routes/countries");
const tasteProfilesRoute = require("./routes/tasteProfiles");

// Models
const Recipe = require("./models/recipe");
const Country = require("./models/country");
const RecipeVariation = require("./models/recipeVariation");
const TasteProfile = require("./models/tasteProfile");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // serve public folder
app.use(helmet());

// Mongo Connection
mongoose
  .connect("mongodb://localhost:27017/world_sauces", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...", err));

const recipe = new Recipe({
  title: "Texas BBQ Sauce",
  image_link: "https://www.glennchon.com",
  author: "WorldSauces",
  submitted_date: Date.now(),
  last_edited: Date.now(),
  origin_country: { name: "USA", code: "US" },
  description: "Some Text Description of sauce.",
  likes: 12,
  taste_profile: [
    "BITTER",
    "NUMBING",
    "SALTY",
    "SOUR",
    "SPICY",
    "SWEET",
    "UMAMI"
  ],
  ingredients: [
    { amount: "1", measurement: "Cup", ingredient: "Chili powder" },
    { amount: "2", measurement: "Tablespoon", ingredient: "Water" },
    { amount: "3", measurement: "Teaspoon", ingredient: "Salt" }
  ],
  instructions: [
    "Step 1 instructions",
    "Step 2 instructions",
    "Step 3 instructions",
    "Step 4 instructions"
  ]
});

// Recipes
// Get all recipes
getRecipes = async () => {
  const pageNumber = 1;
  const pageSize = 24;

  const recipes = await Recipe.find()
    .sort({ likes: -1 })
    .select({ title: 1, origin_country: 1, likes: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
  console.log(recipes);
  return recipes;
};

// Create a new recipe
createRecipe = async recipe => {
  // save recipe
  const result = await recipe.save();
  console.log(result);

  return await UpdateQueryFirstRecipeVars(recipe);
};

// Get recipe by id
getRecipe = async id => {
  const result = await Recipe.findById(id);
  if (!result) return;
  return result;
  console.log(result);
};

// Update recipe
updateRecipe = async recipe => {
  const result = await Recipe.findById(recipe._id);
  if (!result) return;

  return await recipe.save();
};

// Like Recipe
likeRecipe = async recipe => {
  recipe.update({ $inc: { likes: 1 } });
};

// Recipe Variations //
// Get All
getRecipeVars = async () => {
  const pageNumber = 1;
  const pageSize = 24;

  const recipeVariations = await RecipeVariation.find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
  console.log(recipeVariations);
  return recipeVariations;
};

// Get By Search Value
getRecipeVarsByValue = async searchValue => {
  const pageNumber = 1;
  const pageSize = 24;
  // Substring search
  const recipeVariations = await RecipeVariation.find({
    title: new RegExp(searchValue, "i")
  })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
  console.log(recipeVariations);
  return recipeVariation;
};

// Get By Country
getRecipeVarsByCountry = async code => {
  const pageNumber = 1;
  const pageSize = 24;
  // Exact country code match
  const recipeVariations = await RecipeVariation.find({
    "origin_country.code": new RegExp("^" + code + "$", "i")
  })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
  console.log(recipeVariations);
  return recipeVariations;
};

// Get By Search Value and Country
getRecipeVarsByValueCountry = async (searchValue, code) => {
  const pageNumber = 1;
  const pageSize = 24;
  const recipeVariations = await RecipeVariation.find()
    .and([
      {
        title: new RegExp(searchValue, "i")
      },
      {
        "origin_country.code": new RegExp("^" + code + "$", "i")
      }
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  console.log(recipeVariations);
  return recipeVariations;
};

// Update Query First Recipe Variation
UpdateQueryFirstRecipeVars = async recipe => {
  // Check if recipeVariation exists for specific title and country
  const recipeVariation = await RecipeVariation.findOne().and([
    {
      title: new RegExp("^" + recipe.title + "$", "i")
    },
    {
      "origin_country.code": new RegExp(
        "^" + recipe.origin_country.code + "$",
        "i"
      )
    }
  ]);

  // if there is no recipeVariation list, create a new one, else add to existing
  if (!recipeVariation) {
    return await createRecipeVariation(recipe);
  } else {
    return await addRecipeVariation(recipeVariation, recipe);
  }
};

// Create new variation list
createRecipeVariation = async recipe => {
  const recipeVariation = new RecipeVariation({
    title: recipe.title,
    origin_country: {
      name: recipe.origin_country.name,
      code: recipe.origin_country.code
    },
    recipes: [
      {
        recipe_data: { image_link: recipe.image_link, likes: recipe.likes },
        recipe: recipe._id
      }
    ]
  });

  return await recipeVariation.save();
};

// Add to existing variation list, update First
addRecipeVariation = async (recipeVariation, recipe) => {
  const result = await RecipeVariation.update(
    { _id: recipeVariation._id },
    {
      $push: {
        recipes: {
          recipe_data: { image_link: recipe.image_link, likes: recipe.likes },
          recipe: recipe._id
        }
      }
    }
  );
  console.log(result);
  return result;
};

// Update likes for existing recipe variation
// TODO

// Countries //
// Get all countries
getCountries = async () => {
  const countries = await Country.find().select({ _id: 0, name: 1, code: 1 });
  console.log(countries);
  return countries;
};

// Taste Profiles //
// Get all taste profiles
getTasteProfiles = async () => {
  const tasteProfiles = await TasteProfile.find();
  console.log(tasteProfiles);
  return tasteProfiles;
};

// User //
// Create new user
// Get User by id
// Update User
// Delete User

// getRecipes();
// getRecipeVars();
// getRecipeVarsByValue("BBQ");
// getRecipeVarsByCountry("US");
// getRecipeVarsByValueCountry("bbq", "Us");
// getCountries();
// getTasteProfiles();
// UpdateQueryFirstRecipeVars(recipe);

app.use("/", homeRoute);
app.use("/api/recipes", recipesRoute);
// app.use("/api/recipevariations", recipeVariationsRoute);
// app.use("/api/users", usersRoute);
app.use("/api/countries", countriesRoute);
app.use("/api/tasteprofiles", tasteProfilesRoute);

console.log("Application Name: " + config.get("name"));
// console.log("Mail Server: " + config.get("mail.host"));
// console.log("Mail Password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny")); // logger middleware
  startupDebugger("Morgan enabled...");
}

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
