const express = require("express");
const router = express.Router();

// Home
router.get("/", (req, res) => {
  res.render("body", {
    title: "World Sauce Api Documentation Page",
    message: "Hello"
  });
});

module.exports = router;
