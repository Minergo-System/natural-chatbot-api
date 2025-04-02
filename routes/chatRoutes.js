const express = require("express");
const { logToDatabase } = require("../config/database");
const { apiKeyMiddleware } = require("../middleware/middleware");
const router = express.Router();
const natural = require("natural");

router.post("/", apiKeyMiddleware, (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  
  // Cek apakah model memiliki kategori yang cocok
  let bestMatch = null;
  let bestConfidence = 0;
  
  global.trainingData.forEach((item) => {
    const similarity = natural.JaroWinklerDistance(userMessage, item.text);
    if (similarity > bestConfidence) {
      bestConfidence = similarity;
      bestMatch = item.category;
    }
  });

  // Jika confidence terlalu rendah, berikan respons default
  const CONFIDENCE_THRESHOLD = 0.7;
  if (bestConfidence < CONFIDENCE_THRESHOLD) {
    const defaultResponse = {
      response: "Maaf aku tidak mengerti yang kamu maksud. Kamu bisa bertanya lebih detail kepada Tim kami melalui Whatsapp berikut: https://wa.me/628115495565"
    };

    logToDatabase(userMessage, defaultResponse.response);
    return res.json(defaultResponse);
  }

  // Ambil respons dari kategori yang ditemukan
  const response = global.responses.find((r) => r.category === bestMatch) || {
    response: "Maaf aku tidak mengerti yang kamu maksud."
  };

  logToDatabase(userMessage, response.response);
  res.json(response);
});

module.exports = router;
