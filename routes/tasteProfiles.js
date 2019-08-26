const express = require("express");
const router = express.Router();

const {
  TasteProfile,
  validateTasteProfile
} = require("../models/tasteProfile");

// TASTE PROFILES
// Get list of taste profiles
router.get("/", async (req, res) => {
  const tasteProfiles = await TasteProfile.find().sort({ name: 1 });
  res.send(tasteProfiles);
});

module.exports = router;
