const express = require("express");
const router = express.Router();

const tasteProfiles = require("../_tempData/tasteProfiles.json"); // temp

// TASTE PROFILES
// Get list of taste profiles
router.get("/", (req, res) => {
  res.send(tasteProfiles);
});

module.exports = router;
