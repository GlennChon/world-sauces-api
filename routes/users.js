const auth = require("../middleware/auth");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password"); // get user object, exclude password
  res.send(user);
});

// Register User
router.post("/", async (req, res) => {
  // Validation schema using Joi
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;

// Increment User Like Count
incrementUserLikes = async user => {
  return await user.updateOne({ $inc: { likes: 1 } });
};

// Decerement User Like Count
decrementUserLikes = async user => {
  return await user.updateOne({ $inc: { likes: -1 } });
};
// User //
// Create new user
// Get User by id
getUserById = async id => {
  const user = await User.findById(id);
  if (!user) return;
  return user;
};
// Update User
// Delete User