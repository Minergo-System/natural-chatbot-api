const express = require("express");
const cors = require("cors");
const natural = require("natural");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const responses = JSON.parse(fs.readFileSync("responses.json", "utf8"));

const trainingData = JSON.parse(fs.readFileSync("trainingData.json", "utf8"));

const classifier = new natural.BayesClassifier();

trainingData.forEach((item) => {
  classifier.addDocument(item.text, item.category);
});

classifier.train();

app.post("/chat", (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  const responseType = classifier.classify(userMessage);

  const response = responses[responseType] || responses["default"];

  res.json(response);
});

app.listen(3000, () => console.log("Chatbot berjalan di http://localhost:3000"));
