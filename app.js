const _ = require("underscore");
const morgan = require("morgan");
const config = require("config");
const express = require("express");
const winston = require("winston");

const app = express();

// Startup
winston.info("Application Name: " + config.get("name"));

if (app.get("env") === "development") {
  app.use(morgan("tiny")); // logger middleware
  winston.info("Morgan enabled...");
}

require("./startup/db")();
require("./startup/routes")(app);
// require("./startup/logging")();
// require("./startup/cors")(app);
// require("./startup/config")();
// require("./startup/validation")();

// TODO: make mail server connection for sending confirmation mail
// console.log("Mail Server: " + config.get("mail.host"));
// console.log("Mail Password: " + config.get("mail.password"));

// Port
const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

// let user = new User({
//   username: "WorldSauces",
//   firstname: "Glenn",
//   lastname: "Chon",
//   about: "Creator of World Sauces, direct inquiries to Glenn.Chon@gmail.com",
//   email: "Glenn.Chon@gmail.com",
//   password: "testPassword1$",
//   isAdmin: true,
//   likes: 0
// });

// // Sample Recipe
// let recipe = new Recipe({
//   likes: 2,
//   image_link:
//     "https://cdn2.tmbi.com/TOH/Images/Photos/37/1200x1200/exps156976_THCA153054A06_13_4b.jpg",
//   taste_profile: ["SALTY", "SOUR", "SPICY", "SWEET"],
//   ingredients: [
//     "15 oz Tomato Sauce",
//     "1/2 Cup Apple Juice",
//     "1/4 Cup Apple Cider Vinegar",
//     "1/4 Cup Packed Dark Brown Sugar",
//     "2 Tablespoons Molasses",
//     "1 Tablespoon Worcestershire Sauce",
//     "1 Tablespoon Onion Powder",
//     "2 Teaspoons Garlic Powder",
//     "1 Teaspoon Mustard",
//     "1/4 Teaspoon Cayenne Pepper"
//   ],
//   instructions: [
//     "Combine all ingredients in sauce pan.",
//     "Simmer over low heat for 20 minutes, stirring periodically."
//   ],
//   title: "Test",
//   author: "WorldSauces",
//   submitted_date: Date.now(),
//   last_edited: Date.now(),
//   origin_country: { name: "Canada", code: "CA" },
//   description: "A basic Texas BBQ sauce 2."
// });

// getRecipes();
// getRecipesByValue("BBQ");
// getRecipesByCountry("US");
// getRecipesByValueCountry("bbq", "Us");
// getRecipeById("5d6279567fb75f0f38842f25");
// getCountries();
// getTasteProfiles();
//createRecipe(recipe);
async function testFunction() {
  let test;
  //test = await createRecipe(recipe);
  //test = await updateRecipe("5d63b2bceffa723c9c8ba84d");
  //let inc = await decrementRecipeLikes(test);
  // console.log(inc);

  //console.log(test);
  //await getRecipesByValueCountry("bbq", "US");
}

testFunction();

module.exports = server;
