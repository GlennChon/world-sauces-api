const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
  User,
  validateUser,
  validateUserUpdate,
  validateAccountUpdate
} = require("../models/user");
const { Recipe } = require("../models/recipe");

const mongoose = require("mongoose");
const Fawn = require("fawn");

Fawn.init(mongoose);
const router = express.Router();

// User //
router.get("/all", [auth, admin], async (req, res) => {
  const pageNumber = 1;
  const pageSize = 24;
  const users = await User.find()
    .select("-password -email -firstname -lastname")
    //pagination
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
  res.send(users);
});

// Post to get user info
router.post("/me", auth, async (req, res) => {
  const user = await User.findOne({ username: req.body.username }).select(
    "-password -isAdmin"
  );
  if (!user) return res.status(400).send("No user with that id found");
  res.send(user);
});

// Get basic public info of any user
router.get("/:username", async (req, res) => {
  const usernameRegex = new RegExp("^" + req.params.username + "$", "i");
  const user = await User.findOne({ username: usernameRegex }).select(
    "-password -email -emailVerified -isAdmin -likes -firstName -lastName"
  );

  if (!user) return res.status(400).send("No user with that username found");

  res.send(user);
});

// Register User
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .send({ ex: "Email", message: "Email already registered." });

  user = await User.findOne({ username: req.body.username });
  if (user)
    return res
      .status(400)
      .send({ ex: "Username", message: "Username already registered." });

  user = new User(_.pick(req.body, ["username", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res
    .header("ws-auth-token", token)
    .send(_.pick(user, ["_id", "username", "email", "isAdmin"]));
});

// Put User by ID (Update)
router.put("/me", auth, async (req, res) => {
  try {
    const { error } = validateUserUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const result = await User.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          about: req.body.about
        }
      }
    ).select("-password");
    res.send(result);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

// Update password and email
router.put("/account", auth, async (req, res) => {
  const { error } = validateAccountUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Find user
  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("No user associated with username.");

  // Check if user email is the same as input email
  if (user.email != req.body.email) {
    // if not equal, count to see how many accounts have that email
    let count = await User.countDocuments({
      _id: { $ne: user._id },
      email: req.body.email
    });
    // if there is already an account with that email then return 400
    if (count > 0) {
      return res.status(400).send("Email already registered");
    }

    // set verified to false and user email to new email
    user.isVerified = false;
    user.email = req.body.email;
  }

  // Check if password matches
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password");

  // if there is a new password generate new salt/hash
  if (req.body.newPass && req.body.newPass != "") {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPass, salt);
  }
  // generate new auth token
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("ws-auth-token", token)
    .send(_.pick(user, ["_id", "username", "email", "isAdmin"]));
});

// add liked recipe id to user and increment likes on recipe document
router.put("/like", auth, async (req, res) => {
  let user = await User.findById(req.body.userId).select(
    "-password -email -emailVerified -isAdmin -firstName -lastName"
  );
  if (!user) return res.status(400).send("No user by that id");

  new Fawn.Task()
    .update(
      "users",
      { _id: req.body.userId },
      { $push: { likes: { _id: req.body.recipeId } } }
    )
    .update("recipes", { _id: req.body.recipeId }, { $inc: { likes: 1 } })
    .run({ useMongoose: true })
    .then(async function() {
      const recipe = await Recipe.findById({ _id: req.body.recipeId });
      res.send(recipe);
    })
    .catch(function(ex) {
      res.status(500).send(ex.message);
    });
});

// remove recipe id from user and decerement likes on recipe document
router.put("/unlike", auth, async (req, res) => {
  let user = await User.findById({ _id: req.body.userId }).select(
    "-password -email -emailVerified -isAdmin -firstName -lastName"
  );
  if (!user) return res.status(400).send("No user by that id");

  new Fawn.Task()
    .update(
      "users",
      { _id: req.body.userId },
      { $pull: { likes: req.body.recipeId } }
    )
    .update("recipes", { _id: req.body.recipeId }, { $inc: { likes: -1 } })
    .run({ useMongoose: true })
    .then(async function() {
      const recipe = await Recipe.findById({ _id: req.body.recipeId });
      res.send(recipe);
    })
    .catch(function(ex) {
      res.status(500).send(ex.message);
    });
});

// Delete User: for admin only
router.delete("/:id", [auth, admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return res.status(404).send("The user with given id was not found");
  res.send(user);
});

verifyEmail = async email => {
  //
};

module.exports = router;
