const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  recipes: [
    {
      recipe: {
        ref: "recipes",
        id: mongoose.ObjectId
      },
      recipe_data: {
        likes: Number,
        title: String
      }
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
