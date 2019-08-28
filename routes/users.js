const auth = require("../middleware/auth");
const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");

router.get("/:username", auth, async (req, res) => {
  const user = await User.findOne({
    username: new RegExp("^" + req.params.username + "$", "i")
  }).select("-password -email");
  if (!user) return res.status(400).send("Invalid username.");
  res.send(user);
});

// Register User
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["username", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }

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
