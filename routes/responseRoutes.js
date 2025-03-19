const express = require("express");
const { responses } = require("../config/database");
const router = express.Router();

router.get("/", (req, res) => {
  res.json(responses);
});

module.exports = router;
