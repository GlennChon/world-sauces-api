const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { User, validateUser, validateUserUpdate } = require("../models/user");

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
  const user = await User.findOne({ username: req.params.username }).select(
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
    .send(_.pick(user, ["_id", "username", "email"]));
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
          email: req.body.email,
          about: req.body.about
        }
      }
    ).select("-password");
    res.send(result);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.put("/email", auth, async (req, res) => {
  // Check to see if new email exists in database
  let user = await User.findOne({ email: req.body.newEmail }, { email: 1 });

  // Update email and set verified back to false.
  if (!user) {
    User.update(
      { _id: req.user._id },
      { $set: { email: newEmail, emailVerified: false } }
    );
  }
});

// Update password
router.put("/password", auth, async (req, res) => {
  const user = await User.findById({
    _id: req.user._id
  });

  if (!user) return res.status(400).send("No user associated with id.");
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res.send(user);
});

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
    .then(function(results) {
      const userResult = results[0];
      res.send(userResult);
    })
    .catch(function(ex) {
      res.status(500).send(ex.message);
    });
});

router.put("/unlike", auth, async (req, res) => {
  let user = await User.findById({ _id: req.body.userId }).select(
    "-password -email -emailVerified -isAdmin -firstName -lastName"
  );
  console.log(user);
  if (!user) return res.status(400).send("No user by that id");

  new Fawn.Task()
    .update(
      "users",
      { _id: req.body.userId },
      { $pull: { likes: req.body.recipeId } }
    )
    .update("recipes", { _id: req.body.recipeId }, { $inc: { likes: -1 } })
    .run({ useMongoose: true })
    .then(function(results) {
      const userResult = results[0];
      res.send(userResult);
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
