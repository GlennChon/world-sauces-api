const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const { User } = require("../models/user");

const router = express.Router();

// Authenticate User
router.post("/", async (req, res) => {
  // Validation schema using Joi
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user exists
  // By email
  let user = await User.findOne({ email: req.body.user });
  // By username
  if (!user) {
    const usernameRegex = new RegExp("^" + req.body.user + "$", "i");
    user = await User.findOne({ username: usernameRegex });
  }
  // No result
  if (!user) return res.status(400).send("Invalid email or password");

  // Check if password matches
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.send(token);
});

// Joi validation
function validate(req) {
  const schema = {
    user: Joi.string()
      .min(5)
      .max(255)
      .required(),
    password: Joi.string()
      .min(5)
      .max(1024)
      .required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
