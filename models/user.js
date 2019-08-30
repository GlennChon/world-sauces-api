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
  about: { type: String, default: "" },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
    validate: {
      validator: function(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const msg = "Please enter a valid email";

        return emailRegex.test(email);
      },
      message: "Please enter a valid email."
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  registerDate: { type: Date, default: Date.now },
  emailVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  likes: [{ types: mongoose.Schema.Types.ObjectId, ref: recipeSchema }]
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
};

// Joi validation
function validateUser(user) {
  const schema = {
    username: Joi.string()
      .alphanum()
      .min(5)
      .max(16)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9!@#$%^&*()]{6,24}$/)
      .min(6)
      .max(24)
      .required()
  };
  return Joi.validate(user, schema);
}

const User = mongoose.model("users", userSchema);
module.exports = { User, validateUser };
