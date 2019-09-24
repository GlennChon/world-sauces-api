const Joi = require("joi"); // Input Validation
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Recipe, recipeSchema, validateRecipe } = require("./recipe");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    min: 3,
    max: 20
  },
  firstName: { type: String, default: "", maxlength: 50 },
  lastName: { type: String, default: "", maxLength: 50 },
  about: { type: String, default: "", maxLength: 1000 },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  registerDate: { type: Date, default: Date.now },
  emailVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: recipeSchema }]
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      isAdmin: this.isAdmin
    },
    config.get("jwtPrivateKey")
  );
};
function validateUserUpdate(user) {
  const schema = {
    _id: Joi.string(),
    firstName: Joi.string()
      .allow("", null)
      .max(50),
    lastName: Joi.string()
      .allow("", null)
      .max(50),
    about: Joi.string()
      .allow("", null)
      .max(1000)
  };
  return Joi.validate(user, schema);
}

function validateAccountUpdate(user) {
  const schema = {
    password: Joi.string()
      .required()
      .min(6),
    newPass: Joi.string()
      .allow("", null)
      .min(6),
    username: Joi.string()
      .required()
      .min(3)
      .max(20),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email()
  };
  return Joi.validate(user, schema);
}

// Joi validation
function validateUser(user) {
  const schema = {
    username: Joi.string()
      .min(3)
      .max(16)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required(),
    firstName: Joi.string()
      .allow("", null)
      .max(50),
    lastName: Joi.string()
      .allow("", null)
      .max(50)
  };
  return Joi.validate(user, schema);
}

const User = mongoose.model("users", userSchema);
module.exports = {
  User,
  validateUser,
  validateUserUpdate,
  validateAccountUpdate
};
