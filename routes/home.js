const express = require("express");
const router = express.Router();
// Home
// Get
router.get("/", (req, res) => {
  res.render("index", { title: "World Sauce Api Home Page", message: "Hello" });
});

module.exports = router;
