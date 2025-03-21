require("dotenv").config();
const mysql = require("mysql2");
const natural = require("natural");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Buat variable global
global.responses = [];
global.trainingData = [];
global.classifier = new natural.BayesClassifier();

const loadCache = () => {
  db.query("SELECT * FROM responses", (err, result) => {
    if (err) {
      console.error("Error fetching responses: ", err);
      return;
    }
    
    global.responses = result.map((item) => ({
      ...item,
      prompts: (() => {
        try {
          return JSON.parse(item.prompts);
        } catch (e) {
          console.error("Error parsing prompts: ", e);
          return [];
        }
      })(),
    }));
  });

  db.query("SELECT * FROM training_data", (err, result) => {
    if (err) {
      console.error("Error fetching training data: ", err);
      return;
    }

    global.trainingData = result;
    global.classifier = new natural.BayesClassifier(); // Reset classifier sebelum melatih ulang

    trainingData.forEach((item) => {
      global.classifier.addDocument(item.text, item.category);
    });

    global.classifier.train();
    console.log("Classifier trained successfully.");
  });
};

const logToDatabase = (message, response) => {
  const timestamp = new Date(Date.now() + 8 * 60 * 60 * 1000) // Tambah 8 jam
    .toISOString()
    .slice(0, 19)
    .replace("T", " "); // Format YYYY-MM-DD HH:MM:SS

  db.query(
    "INSERT INTO logs (message, response, timestamp) VALUES (?, ?, ?)",
    [message, response, timestamp],
    (err) => {
      if (err) {
        console.error("Error logging to database: ", err);
      }
    }
  );
};

// Perbarui cache setiap 1 jam
setInterval(loadCache, 60000);

module.exports = { db, loadCache, logToDatabase };
