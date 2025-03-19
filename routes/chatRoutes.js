// routes/chatRoutes.js
const express = require("express");
const { responses, classifier } = require("../config/database");
const router = express.Router();

router.post("/", (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  const responseType = classifier.classify(userMessage);
  const response = responses.find((r) => r.category === responseType) || { response: "Maaf, saya tidak mengerti." };
  res.json(response);
});

module.exports = router;
