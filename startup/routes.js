const helmet = require("helmet");
const express = require("express");
const error = require("../middleware/error");
const auth = require("../middleware/auth");
const docsRoute = require("../routes/docs");
const usersRoute = require("../routes/users");
const recipesRoute = require("../routes/recipes");
const countriesRoute = require("../routes/countries");
const tasteProfilesRoute = require("../routes/tasteProfiles");

module.exports = function(app) {
  app.use(express.json());
  app.use(express.static("public")); // serve public folder
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());

  app.use("/api/docs", docsRoute);
  app.use("/api/auth", auth);
  app.use("/api/users", usersRoute);
  app.use("/api/recipes", recipesRoute);
  app.use("/api/countries", countriesRoute);
  app.use("/api/tasteprofiles", tasteProfilesRoute);

  app.use(error);
};
