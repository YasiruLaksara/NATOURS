const fs = require("fs");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  //Execute Querry
  const users = await User.find();

  //Send Response
  res
    .status(200)
    .json({ status: "success", results: users.length, data: { users } });
});

exports.createUsers = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "Route wasn't implemented yet." });
};

exports.getUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "Route wasn't implemented yet." });
};

exports.updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "Route wasn't implemented yet." });
};

exports.deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "Route wasn't implemented yet." });
};
