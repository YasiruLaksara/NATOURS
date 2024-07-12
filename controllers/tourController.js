const fs = require("fs");
const Tour = require("./../models/tourModel");

//////This only used for our testing perposes
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`)
// ); //convert to arrays of javascript objects

exports.getAllTours = async (req, res) => {
  try {
    //Building Querry
    const queryObj = { ...req.query };
    // console.log(queryObj);
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    console.log(req.query);
    //Building Advanced Query(gte/lte/gt/lt)

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    const query = Tour.find(JSON.parse(queryStr)); //sort and find using parameters

    //Execute Querry
    const tours = await query;

    //Send Response
    res
      .status(200)
      .json({ status: "success", results: tours.length, data: { tours } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.x);
    // Tour.findOne({"_id": req.params.x})

    res.status(200).json({ status: "success", data: { tour } });
  } catch (err) {
    return res.status(404).json({ status: "fail", message: "Invalid ID" });
  }
};

exports.createTour = async (req, res) => {
  try {
    const document = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: document,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.x, req.body, {
      new: true,
    });

    res.status(200).json({ status: "success", data: { tour } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.x);
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
