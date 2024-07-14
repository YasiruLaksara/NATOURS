const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken"); // eslint-disable-line no-To create a json web token //npm i jsonwebtoken
const AppError = require("./../utils/appError");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res
    .status(201)
    .json({ status: "success", token: token, data: { user: newUser } });
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //1) check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2) check if user exists and password is correct

  const user = await User.findOne({ email: email }).select("+password"); //+ is used becouse it is not represent
  const correct = await user.correctPassword(password, user.password);
  // console.log(user);
  // console.log(password);
  // console.log(user.password);

  if (!user || !correct) {
    return next(new AppError("Invalid email or password", 401));
  }

  //3) check if password is correct and send token to the client
  const token = await signToken(user._id);
  res.status(200).json({ status: "success", token: token });
});

exports.protect = catchAsync(async (req, res, next) => {
  // console.log(req.header);
  //middleware to authenticate routes

  let token;

  //1)Getting token and check of it's there

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in. Please log in!", 401));
  }

  //2)verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(decoded);

  //3)check if user still exists
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError("User no longer exists", 401));
  }

  //4)check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User changed password.Please Log again.", 401));
  }

  //Grant Access to protected route
  req.user = freshUser;
  next();
});
