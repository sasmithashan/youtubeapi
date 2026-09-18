const express = require("express");
const cors = require("cors");
const YTMusic = require("ytmusic-api");

const app = express();
const ytmusic = new YTMusic();

// Cross-Origin Resource Sharing (CORS) Enable කිරීම
app.use(cors());
app.use(express.json());

// API එක On වන විට YTMusic Initialize කිරීම
let isInitialized = false;
async function initYTMusic() {
    try {
        await ytmusic.initialize();
        isInitialized = true;
        console.log("YTMusic API initialized successfully!");
    } catch (err) {
        console.error("YTMusic initialization failed:", err);
    }
}
initYTMusic();

// Base Route
app.get("/", (req, res) => {
    res.send("YTMusic API Server is running!");
});

// Search Route
app.get("/search", async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    if (!isInitialized) {
        return res.status(503).json({ error: "Service is still initializing, try again in a few seconds." });
    }

    try {
        const results = await ytmusic.search(query);
        res.json(results);
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ error: "Something went wrong while searching" });
    }
});

// Port Setup (Koyeb මගින් process.env.PORT ස්වයංක්‍රීයව ලබාදේ)
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});