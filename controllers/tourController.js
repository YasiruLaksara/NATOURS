const fs = require("fs");
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
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

exports.getAllTours = catchAsync(async (req, res, next) => {
  //Execute Querry
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  //Send Response
  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.x);
  // Tour.findOne({"_id": req.params.x})

  res.status(200).json({ status: "success", data: { tour } });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const document = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: document,
    },
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return res
      .status(404)
      .json({ status: "fail", message: "No tour found with that ID" });
  }

  res.status(200).json({ status: "success", data: { tour } });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.x);
  res.status(204).json({ status: "success", data: null });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" }, // group based on dificulty levels
        numTours: { $sum: 1 }, //no of documents == no.of tours.we will add 1 each time a document passes
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 }, // 1 for ascending order
    },
    // {
    //   $match: { _id: { $ne: "EASY" } }, //exclude easy level tours
    // },
  ]);

  res.status(200).json({ status: "success", data: { stats } });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = parseInt(req.params.year);
  const plans = await Tour.aggregate([
    {
      $unwind: "$startDates", //deconstruct(break) array of elements
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" }, //add a new field
    },
    {
      $project: {
        //project is used to show or hide fields .0 means hide
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({ status: "success", data: { plans } });
});
