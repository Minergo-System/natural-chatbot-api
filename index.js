require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const natural = require("natural");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


db.connect(err => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

let responses = [];
let trainingData = [];
const classifier = new natural.BayesClassifier();

const loadCache = () => {
  db.query("SELECT * FROM responses", (err, result) => {
    if (err) {
      console.error("Error fetching responses: ", err);
      return;
    }
    responses = result.map(item => ({
      ...item,
      prompts: JSON.parse(item.prompts)
    }));
  });

  db.query("SELECT * FROM training_data", (err, result) => {
    if (err) {
      console.error("Error fetching training data: ", err);
      return;
    }
    trainingData = result;
    
    // Train classifier after data is loaded
    // classifier.clear();
    trainingData.forEach((item) => {
      classifier.addDocument(item.text, item.category);
    });
    classifier.train();
    console.log("Classifier trained successfully.");
  });
};

// Load cache initially
loadCache();

// Refresh cache periodically (optional)
setInterval(loadCache, 360000); // Refresh every 60 minutes

trainingData.forEach((item) => {
  classifier.addDocument(item.text, item.category);
});

app.get("/responses", (req, res) => {
  res.json(responses);
});

app.get("/trainingData", (req, res) => {
  res.json(trainingData);
});

app.post("/chat", (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  const responseType = classifier.classify(userMessage);
  
  const response = responses.find(r => r.category === responseType) || { response: "Maaf, saya tidak mengerti." };
  
  res.json(response);
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


