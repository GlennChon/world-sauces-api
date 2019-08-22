const express = require("express");
const http = require("http");
const _ = require("underscore");
const Joi = require("joi");
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

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // serve public folder
app.use(helmet());

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
