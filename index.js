require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { db, loadCache } = require("./config/database");
const chatRoutes = require("./routes/chatRoutes");
const responseRoutes = require("./routes/responseRoutes");
const trainingRoutes = require("./routes/trainingRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Load initial cache
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
  loadCache();
});

// Set up routes
app.use("/chat", chatRoutes);
app.use("/responses", responseRoutes);
app.use("/trainingData", trainingRoutes);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
