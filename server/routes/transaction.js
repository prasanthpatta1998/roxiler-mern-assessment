const express = require("express");
const db = require("../db/connection");
const router = express.Router();
const Product = require("../model/Product");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const findingMonthNumber = (month) => {
  const monthNumber =
    monthNames.findIndex((name) => name.toLowerCase() === month.toLowerCase()) +
    1;
  return monthNumber;
};

router.get("/", async (req, res) => {
  const { search = "", page = 1, perPage = 10, month } = req.query;
  const pageInt = parseInt(page, 10) || 1;
  const perPageInt = parseInt(perPage, 10) || 10;
  const monthNumber = findingMonthNumber(month);

  const searchQuery = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
  };

  if (search) {
    let typeOfSearch = parseInt(search);
    if (isNaN(typeOfSearch)) {
      typeOfSearch = 0;
    }

    searchQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { price: typeOfSearch },
    ];
  }

  try {
    const products = await Product.find(searchQuery)
      .skip((pageInt - 1) * perPageInt)
      .limit(perPageInt);
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/statistics", async (req, res) => {
  const { month } = req.query;
  const monthNumber = findingMonthNumber(month);

  const query = [
    { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
    {
      $group: {
        _id: null,
        totalSaleAmount: { $sum: "$price" },
        totalSoldItems: { $sum: { $cond: { if: "$sold", then: 1, else: 0 } } },
        totalNotSoldItems: {
          $sum: { $cond: { if: "$sold", then: 0, else: 1 } },
        },
      },
    },
  ];

  try {
    const response = await Product.aggregate(query);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/bar-chart", async (req, res) => {
  const { month } = req.query;
  const monthNumber = findingMonthNumber(month);

  const priceRanges = [
    { range: "0-100", min: 0, max: 100 },
    { range: "101-200", min: 101, max: 200 },
    { range: "201-300", min: 201, max: 300 },
    { range: "301-400", min: 301, max: 400 },
    { range: "401-500", min: 401, max: 500 },
    { range: "501-600", min: 501, max: 600 },
    { range: "601-700", min: 601, max: 700 },
    { range: "701-800", min: 701, max: 800 },
    { range: "801-900", min: 801, max: 900 },
    { range: "901-above", min: 901, max: Infinity },
  ];

  const bucketBoundaries = priceRanges.map((range) => range.min);
  bucketBoundaries.push(Infinity);

  const bucketLabels = priceRanges.map((range) => range.range);

  const aggregationPipeline = [
    { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
    {
      $bucket: {
        groupBy: "$price",
        boundaries: bucketBoundaries,
        default: "901-above",
        output: {
          count: { $sum: 1 },
        },
      },
    },
    {
      $project: {
        range: {
          $arrayElemAt: [
            bucketLabels,
            { $indexOfArray: [bucketBoundaries, "$_id"] },
          ],
        },
        count: 1,
      },
    },
  ];

  try {
    const result = await Product.aggregate(aggregationPipeline);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/pie-chart", async (req, res) => {
  const { month } = req.query;
  const monthNumber = findingMonthNumber(month);
  try {
    const aggregationPipeline = [
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ];

    const result = await Product.aggregate(aggregationPipeline);

    const formattedResult = result.map((item) => ({
      category: item._id,
      count: item.count,
    }));

    res.json(formattedResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = {router, findingMonthNumber};
