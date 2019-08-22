const express = require("express");
const _ = require("underscore");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const mongoose = require("mongoose");

const home = require("./routes/home");
const recipes = require("./routes/recipes");
const countries = require("./routes/countries");
const tasteProfiles = require("./routes/tasteProfiles");

const Recipe = require("./models/recipe");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // serve public folder
app.use(helmet());

mongoose
  .connect("mongodb://localhost:27017/world_sauces", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...", err));

async function createRecipe() {
  const recipe = new Recipe({
    title: "North Carolina BBQ Sauce",
    imageLink:
      "https://d104wv11b7o3gc.cloudfront.net/wp-content/uploads/2018/07/carolina-bbq-sauce-1.jpg",
    submittedBy: mongoose.ObjectId(12345),
    submittedDate: Date.now(),
    edited: [
      {
        editor: mongoose.ObjectId(11111),
        editDate: Date.now()
      },
      { editor: mongoose.ObjectId(22222), editDate: Date.now() }
    ],
    originCountry: { name: "USA", code: "US" },
    description: "Some Text Description of sauce.",
    tasteProfile: [
      "BITTER",
      "MÁLÀ",
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

  const result = await recipe.save();
  console.log(result);
}

//createRecipe();

app.use("/", home);
app.use("/api/recipes", recipes);
app.use("/api/countries", countries);
app.use("/api/tasteprofiles", tasteProfiles);

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
