const express = require("express");
const { trainingData } = require("../config/database");
const router = express.Router();

router.get("/", (req, res) => {
  res.json(trainingData);
});

module.exports = router;
