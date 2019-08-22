const express = require("express");
const router = express.Router();
// Home
router.get("/", (req, res) => {
  res.send("World Sauces Home");
});

module.exports = router;
