const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


// Use your MongoDB connection string (Replace <password> and <dbname>)
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nasadb";
const dburl="mongodb+srv://admin:admin123@cluster0.dcs4e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected!"))
.catch((error) => console.error("MongoDB Connection Error:", error));

const favoriteSchema = new mongoose.Schema({
  originalId: { type: String, required: true, unique: true }, // ✅ Ensures no duplicates
  title: String,
  date: String,
  url: String,
  explanation: String,
});

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
axios.get(`${REACT_APP_API_URL}/getPastData`)

const Favorite = mongoose.model("Favorite", favoriteSchema);


// Create Schema
const nasaSchema = new mongoose.Schema({
    title: String,
    date: String,
    url: String,
    explanation: String
});
const NasaData = mongoose.model("NasaData", nasaSchema);

app.get("/", async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split("T")[0]; // Default: today's date
        const apiKey = process.env.NASA_API_KEY || "DEMO_KEY"; // Replace with your NASA API key

        console.log(`Fetching data for date: ${date}`); // Debugging

        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching NASA data:", error.message);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.post("/saveData", async (req, res) => {
  try {
      const { date } = req.body;

      // 🔹 Check if the data for that date already exists
      const existing = await NasaData.findOne({ date });
      if (existing) {
          console.log("⚠️ Data already exists, skipping save.");
          return res.status(400).send("Data already saved");
      }

      // ✅ Save new data only if it does not exist
      const newData = new NasaData(req.body);
      await newData.save();
      res.send("Data saved successfully!");
  } catch (err) {
      console.error("❌ Error saving data:", err.message);
      res.status(500).send(err.message);
  }
});

  
  // Fetch Past Data from MongoDB
  app.get(`${REACT_APP_API_URL}/getPastData`, async (req, res) => {
    try {
      const pastData = await NasaData.find().sort({ date: -1 });
      console.log("Fetched past data:", pastData); // ✅ Debugging log
      res.json(pastData);
    } catch (err) {
      console.error("Error fetching past data:", err);
      res.status(500).send(err.message);
    }
  });

  app.post("/favorites", async (req, res) => {
    try {
      const { originalId, title, date, url, explanation } = req.body;
  
      // ✅ Check if already in favorites
      const existing = await Favorite.findOne({ originalId });
      if (existing) return res.status(400).send("Already in favorites");
  
      // ✅ Save new favorite
      const newFavorite = new Favorite({ originalId, title, date, url, explanation });
      await newFavorite.save();
  
      res.send("Added to favorites!");
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  
  // ✅ Route to Get All Favorites
  app.get("/favorites", async (req, res) => {
    try {
      const favorites = await Favorite.find();
      res.json(favorites);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // ✅ Route to Remove Favorite
  app.delete("/favorites/:id", async (req, res) => {
    try {
      await Favorite.findByIdAndDelete(req.params.id);
      res.send("Removed from favorites!");
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.get("/detail/:id", async (req, res) => {
    try {
        const item = await NasaData.findById(req.params.id);
        if (!item) return res.status(404).send("Data not found");

        res.json(item);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// mongodb+srv://admin:admin123@cluster0.dcs4e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0