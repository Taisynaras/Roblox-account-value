// index.js - Roblox Limited Value API Server (Working Version)

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

let limitedItems = {};

// Get Rolimons Item Data
async function loadRolimonsData() {
  try {
    const response = await axios.get("https://www.rolimons.com/itemapi/itemdetails");
    limitedItems = response.data.items;
    console.log("✅ Rolimons data loaded successfully.");
  } catch (err) {
    console.error("❌ Failed to fetch Rolimons data:", err.message);
  }
}

app.get("/", (req, res) => {
  res.send("🎮 Roblox API is running successfully!");
});

app.post("/calculate", (req, res) => {
  const assetIds = req.body.assetIds;

  let total = 0;
  let found = [];

  for (const id in limitedItems) {
    if (assetIds.includes(parseInt(id))) {
      const item = limitedItems[id];
      const value = item[3] || item[1] || 0;
      total += value;
      found.push({
        id,
        name: item[0],
        value
      });
    }
  }

  res.json({
    totalValue: total,
    matchingItems: found
  });
});

app.listen(port, () => {
  console.log(`✅ Server live on port ${port}`);
  loadRolimonsData();
});