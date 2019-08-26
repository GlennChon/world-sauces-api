const mongoose = require("mongoose");
const Joi = require("joi"); // Input Validation
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  firstname: { type: String, default: "", maxlength: 50 },
  lastname: { type: String, default: "", maxLength: 50 },
  about: { type: String, default: "" },
  email: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024
  },
  isAdmin: { type: Boolean, default: false },
  recipes: [{}],
  totalLikes: { type: Number, default: 0, required: true }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

// Joi validation
function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(1024)
      .required()
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
