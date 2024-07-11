const app = require("./app");
const dotenv = require("dotenv"); //before that npm i dotenv
const mongoose = require("mongoose");

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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour name is required"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
});

const Tour = mongoose.model("Tour", tourSchema); //collection

const document = new Tour({ name: "Down South", rating: 4.9, price: 4500 });

document
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err);
  });

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on the ${port}...`);
});
