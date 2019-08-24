const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  firstname: String,
  lastname: String,
  email: String,
  recipesAdded: Number,
  likes: [
    {
      recipe: mongoose.ObjectId
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
