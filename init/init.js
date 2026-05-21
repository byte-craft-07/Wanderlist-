const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlist";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to db");
}

const initdb = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

main()
  .then(initdb)
  .catch((err) => {
    console.log(err);
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
