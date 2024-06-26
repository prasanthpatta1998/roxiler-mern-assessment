const express = require("express");
const cors = require("cors");
const seedDatabase = require("./seedDatabase");
const { router } = require("./routes/transaction");
const combinedRoute = require("./routes/combinedData");
const connectDB = require("./db/connection");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
connectDB();

app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.error("MongoDB is not connected");
    return res.status(500).json({ message: "MongoDB is not connected" });
  }
  next();
});

app.use("/transactions", router);
app.use("/combined-data", combinedRoute);

app.get("/init-db", async (req, res) => {
  try {
    await seedDatabase();
    res.send("Database initialized and seeded successfully");
  } catch (err) {
    res.status(500).send("Error initializing the database");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
