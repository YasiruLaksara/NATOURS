const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour name is required"],
    unique: true,
  },

  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },

  maxGroupSize: {
    type: Number,
    required: [true, "Max group size is required"],
  },

  difficulty: {
    type: String,
    required: [true, "Difficulty is required"],
    enum: {
      values: ["easy", "medium", "hard"],
      message: "Difficulty must be easy, medium, or hard",
    },
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },

  priceDiscount: {
    type: Number,
  },

  summary: {
    type: String,
    required: [true, "Summery is required"],
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  imageCover: {
    type: String,
    required: [true, "A tour must contain a cover image"],
  },

  images: {
    type: [String],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  startDates: {
    type: [Date], //Array of dates
  },
});

const Tour = mongoose.model("Tour", tourSchema); //collection

module.exports = Tour;
