const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://prasanthpatta:Prasanth1998@cluster0.pvxlyfo.mongodb.net/seedData?retryWrites=true&w=majority&appName=Cluster0"
    );
  } catch (err) {

    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB