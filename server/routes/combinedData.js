const express = require("express");
const Product = require("../model/Product");
const router = express.Router();

const { findingMonthNumber } = require("./transaction");

router.get("/", async (req, res) => {
  const { month } = req.query;
  const monthNumber = findingMonthNumber(month);

  try {
    const statisticsResponse = await fetch(
      `http://localhost:3001/transactions/statistics?month=${month}`
    );
    const statisticsData = await statisticsResponse.json();

    const pieChartResponse = await fetch(
      `http://localhost:3001/transactions/pie-chart?month=${month}`
    );
    const pieChartData = await pieChartResponse.json();

    const barChartResponse = await fetch(
      `http://localhost:3001/transactions/bar-chart?month=${month}`
    );
    const barChartData = await barChartResponse.json();

    const combinedData = {
      statistics: statisticsData,
      barChart: barChartData,
      pieChart: pieChartData,
    };

    res.status(200).json(combinedData);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
