const mongoose = require("mongoose");
const fetchData = require("./fetch/data");
const Product = require("./model/Product");

const seedDatabase = async () => {
  const data = await fetchData();

  try {
    await Product.deleteMany({});
    await Product.create(data);
    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

module.exports = seedDatabase;
