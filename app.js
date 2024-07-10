const express = require("express"); //Loading the package
const { status } = require("express/lib/response");
const morgan = require("morgan");

const app = express();

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

//middlwares

app.use(morgan("dev")); //middleware
app.use(express.json()); //middleware to parse the body of the request
app.use(express.static(`${__dirname}/public`)); //middleware to serve static files

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

// use routers
app.use("/api/v1/tours", tourRouter); //creating middlwares

app.use("/api/v1/users", userRouter);

module.exports = app; //for server.js we exporting the application

// tourRouter.route("/").get(getAllTours).post(createTour);

// tourRouter.route("/:x").get(getTour).patch(updateTour).delete(deleteTour);

// userRouter.route("/").get(getAllUsers).post(createUsers);

// userRouter.route("/:x").get(getUser).patch(updateUser).delete(deleteUser);

// app.get("/api/v1/tours", getAllTours);
// app.post("/api/v1/tours", createTour);

// app.get("/api/v1/tours/:x", getTour);
// app.patch("/api/v1/tours/:x", updateTour);
// app.delete("/api/v1/tours/:x", deleteTour);

//Below all implementations are correct

// app.get("/api/v1/tours", (req, res) => {
//   res
//     .status(200)
//     .json({ status: "success", results: tours.length, data: { tours } });
// });

// const getAllTours =(req, res) => {
//   res
//     .status(200)
//     .json({ status: "success", results: tours.length, data: { tours } });
// };

//or

// app.get("/api/v1/tours/:x", getAllTours);

//or

// app.route("/api/v1/tours").get(getAllTours);
