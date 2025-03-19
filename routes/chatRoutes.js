const express = require("express");
const { logToDatabase } = require("../config/database");
const { apiKeyMiddleware } = require("../middleware/middleware");
const router = express.Router();

router.post("/", apiKeyMiddleware, (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  const responseType = global.classifier.classify(userMessage);
  const response = global.responses.find((r) => r.category === responseType) || { response: "Maaf, saya tidak mengerti." };
  logToDatabase(userMessage, response.response);

  res.json(response);
});

module.exports = router;
