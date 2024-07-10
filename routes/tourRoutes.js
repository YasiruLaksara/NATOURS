const express = require("express");
const tourController = require("./../controllers/tourController");
const router = express.Router();

//middlware
router.param("x", (req, res, next, val) => {
  console.log(`Tour Id is: ${val}`);
  next();
});

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:x")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
