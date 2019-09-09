const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { User, validateUser } = require("../models/user");

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

// Get user
router.post("/me", auth, async (req, res) => {
  const user = await User.findOne({ username: req.body.username }).select(
    "-password -isAdmin"
  );
  if (!user) return res.status(400).send("No user with that id found");
  res.send(user);
});

// Get basic public info of any user
router.get("/:id", async (req, res) => {
  const user = await User.findById({
    _id: req.params.id
  }).select(
    "-password -email -emailVerified -isAdmin -likes -firstName -lastName"
  );

  if (!user) return res.status(400).send("No user with that id found");

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
router.put("/", auth, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        about: req.body.about
      }
    }
  );
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
  const user = await User.findByIdandUpdate(
    { _id: req.user._id },
    { $push: { likes: req.body.recipeId } }
  );
  res.send(user);
});

router.put("/unlike", auth, async (req, res) => {
  const user = await User.findByIdandUpdate(
    { _id: req.user._id },
    { $pull: { likes: req.body.recipeId } }
  );
  res.send(user);
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
