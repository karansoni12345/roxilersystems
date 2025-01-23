const axios = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const apiRoutes = require("./routes/api");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// API Routes
app.use("/api", apiRoutes);

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    const response = await axios.get(`http://localhost:${PORT}/api/initialize`);
    console.log("Database intialized");
  }
  catch (err) {
    console.error("Error calling the API:", err.message);
  }
});

