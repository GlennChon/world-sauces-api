const mongoose = require("mongoose");
const Joi = require("joi"); // Input Validation
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    min: 3,
    max: 20
  },
  firstname: { type: String, default: "", maxlength: 50 },
  lastname: { type: String, default: "", maxLength: 50 },
  about: { type: String, default: "" },
  email: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  isAdmin: { type: Boolean, default: false },
  likes: [{ types: mongoose.Schema.Types.ObjectId, ref: "Recipe" }]
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
      .regex(/^[a-zA-Z0-9]{6,16}$/)
      .min(6)
      .max(24)
      .required()
  };
  return Joi.validate(user, schema);
}

const User = mongoose.model("User", userSchema);
module.exports = { User, validateUser };
