require("dotenv").config();
const express = require("express");
const cors = require("cors");
const natural = require("natural");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql2");

// Lakukan koneksi ke database dengan variabel dari .env
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Cek koneksi ke database
db.connect((err) => {
  if (err) {
    console.error("Koneksi ke MySQL gagal:", err);
    return;
  }
  console.log("Terhubung ke MySQL!");
});

const app = express();
app.use(cors());
app.use(express.json());

// Load data
const responses = JSON.parse(fs.readFileSync("responses.json", "utf8"));
const trainingDataPath = path.join(__dirname, "trainingData.json");

// Train classifier dari database
const classifier = new natural.BayesClassifier();
function loadTrainingData() {
  db.query("SELECT text, category FROM training_data", (err, results) => {
    if (err) {
      console.error("Gagal mengambil data training dari MySQL:", err);
      return;
    }
    classifier.docs = [];
    results.forEach((item) => {
      classifier.addDocument(item.text, item.category);
    });
    classifier.train();
    console.log("Chatbot berhasil dilatih ulang dengan data dari MySQL!");
  });
}

// Inisialisasi chatbot pertama kali
loadTrainingData();

// Session-based memory (stores last user input & conversation state)
const userSessions = new Map();

app.post("/chat", (req, res) => {
  let { userId, message } = req.body;
  if (!userId) {
    userId = uuidv4(); // Generate unique ID if not provided
  }
  message = message.toLowerCase();

  let session = userSessions.get(userId) || { lastMessage: "", state: "" };
  let previousMessage = session.lastMessage;
  let conversationState = session.state;

  let responseType;
  let response;

  // Menangani Multi-Turn Conversation
  if (conversationState.startsWith("cara_kerja_") || conversationState.startsWith("keunggulan_")) {
    responseType = conversationState;
    session.state = "";
  } else {
    responseType = classifier.classify(message);
    
    // Jika user bertanya tentang cara kerja atau keunggulan produk, simpan state
    if (responseType.startsWith("cara_kerja_") || responseType.startsWith("keunggulan_")) {
      session.state = responseType;
    }
  }

  if (responses[responseType]) {
    response = responses[responseType];
  } else {
    response = responses["default"];
    saveUnknownQuery(message);
  }

  userSessions.set(userId, session);
  res.json({ userId, response });
});

function saveUnknownQuery(message) {
  db.query("INSERT INTO unknown_queries (message) VALUES (?)", [message], (err) => {
    if (err) {
      console.error("Gagal menyimpan pertanyaan tidak dikenali:", err);
    } else {
      console.log("Pertanyaan tidak dikenali tersimpan di MySQL:", message);
    }
  });
}

app.post("/admin/add-training-data", (req, res) => {
  const { text, category } = req.body;
  if (!text || !category) {
    return res.status(400).json({ message: "Text dan category harus diisi!" });
  }

  db.query("INSERT INTO training_data (text, category) VALUES (?, ?)", [text, category], (err) => {
    if (err) {
      return res.status(500).json({ message: "Gagal menyimpan data training." });
    }

    loadTrainingData();
    res.json({ message: "Pertanyaan berhasil ditambahkan dan chatbot telah dilatih ulang!" });
  });
});

app.get("/admin/unknown-queries", (req, res) => {
  db.query("SELECT * FROM unknown_queries ORDER BY timestamp DESC", (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal membaca data." });
    res.json({ total: results.length, data: results });
  });
});

app.delete("/admin/clear-unknown-queries", (req, res) => {
  db.query("DELETE FROM unknown_queries", (err) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus log pertanyaan tidak dikenali." });
    res.json({ message: "Log pertanyaan tidak dikenali telah dihapus." });
  });
});

app.listen(3000, () => console.log("Chatbot berjalan di http://localhost:3000"));
