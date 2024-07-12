const fs = require("fs");
const Tour = require("./../models/tourModel");

//////This only used for our testing perposes
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`)
// ); //convert to arrays of javascript objects

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //Building Querry
    //1 A)Filtering
    const queryObj = { ...req.query };
    // console.log(queryObj);
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    console.log(req.query);
    //1 B)Advanced Filtering

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr)); //sort and find using parameters

    //2)Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //(sort('price ratingsAverage')

    //3)Field Limiting

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //4)pagination  (no of documents for each page and what is the page i need to view )

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip > numTours) throw new Error("This page does not exist");
    }

    //Execute Querry
    const tours = await query;

    //Send Response
    res
      .status(200)
      .json({ status: "success", results: tours.length, data: { tours } });
  } catch (err) {
    res.status(404).json({ status: "error", message: err.message });
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
