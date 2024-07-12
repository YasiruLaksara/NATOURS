const dotenv = require("dotenv"); //before that npm i dotenv
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("./../../models/tourModel");

dotenv.config({ path: "./config.env" });
// console.log(process.env);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  //.connect(process.env.DATABASE_LOCAL, {
  .connect(DB)
  .then(() => {
    console.log("MongoDB Connected...");
  });

//Read JSON file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data imported");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv.includes("--import")) {
  importData();
} else if (process.argv.includes("--delete")) {
  deleteData();
}

console.log(process.argv);
