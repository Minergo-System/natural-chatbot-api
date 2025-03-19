const mysql = require("mysql2");
const natural = require("natural");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
    responses = result.map((item) => ({
      ...item,
      prompts: JSON.parse(item.prompts),
    }));
  });

  db.query("SELECT * FROM training_data", (err, result) => {
    if (err) {
      console.error("Error fetching training data: ", err);
      return;
    }
    trainingData = result;
    trainingData.forEach((item) => {
      classifier.addDocument(item.text, item.category);
    });
    classifier.train();
    console.log("Classifier trained successfully.");
  });
};

setInterval(loadCache, 360000);

module.exports = { db, loadCache, responses, trainingData, classifier };
