const auth = require("../middleware/auth");
const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");

// User //
// Get user
router.get("/:id", auth, async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id
  }).select("-password -email");

  if (!user) return res.status(400).send(" No user with that id found");

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

// Put User by ID (Update)
router.put("/:id", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        about: req.body.about
      }
    }
  );
});

// Delete User

verifyEmail = async email => {
  //
};

changeEmail = async (userId, newEmail) => {
  // Check to see if new email exists in database
  let user = await User.findOne({ email: newEmail });
  // Update email and set verified back to false.
  if (!user) {
    User.update(
      { _id: userId },
      { $set: { email: newEmail, emailVerified: false } }
    );
  }
};

changePassword = async (userId, newPass) => {
  user = findOne({ _id: userId });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPass, salt);
  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }
};
module.exports = router;
