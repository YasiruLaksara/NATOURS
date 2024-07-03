const express = require("express"); //Loading the package

const app = express();

const fs = require("fs");

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on the ${port}...`);
});

// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ message: "Hello from the server side.", app: "Natours" });
// });

// app.post("/", (req, res) => {
//   res.send("You can post here");
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
); //convert to arrays of javascript objects

app.get("/api/v1/tours", (req, res) => {
  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
});
