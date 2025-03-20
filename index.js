require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/dbConfig");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const sightRoute = require("./routes/sightRoute");
const repositoryRoute = require("./routes/repositoryRoute");
const demoRepoDetailRoute = require("./routes/demoRepoRoute");
const entertainmentRoute = require("./routes/entertainmentRoute");
const restaurantRoute = require("./routes/restaurantRoute");
const hotelRoute = require("./routes/hotelRoute");
const scheduleRoute = require("./routes/scheduleRoute");
const paymentRoute = require("./routes/paymentRoute");
const likeRoute = require("./routes/likeRoute");
const {
  crawlHotel,
  crawlRestaurants,
  crawlReactHotelPage,
  crawlEnters,
  crawlGeneral,
  getHotelReactLink,
} = require("./crawlData/testCrawl");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "GET, POST, PUT, PATCH, DELETE");
    res.status(200).json({});
  }
  next();
});

app.use("/api/v1/repositories", repositoryRoute);
app.use("/api/v1/demoRepo", demoRepoDetailRoute);
app.use("/api/v1/schedules", scheduleRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/sights", sightRoute);
app.use("/api/v1/entertainments", entertainmentRoute);
app.use("/api/v1/restaurants", restaurantRoute);
app.use("/api/v1/hotels", hotelRoute);
app.use("/api/v1/like", likeRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1", authRoute);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // crawlHotel([
  //   "https://63stravel.com/vn/hotel/list?page=1",
  //   "https://63stravel.com/vn/hotel/list?page=2",
  // ]);
  // crawlRestaurants([
  //   "https://63stravel.com/vn/restaurant/list?page=1",
  //   "https://63stravel.com/vn/restaurant/list?page=2",
  //   "https://63stravel.com/vn/restaurant/list?page=3",
  // ]);
  // crawlReactHotelPage(
  //   "https://www.agoda.com/vi-vn/country/vietnam.html?cid=1844104&ds=vahYdymCywQii1ap"
  // );
  // crawlEnters("https://www.bestprice.vn/ve-vui-choi");
  // crawlGeneral(
  //   "https://www.agoda.com/vi-vn/alagon-zen-hotel-spa/hotel/ho-chi-minh-city-vn.html?ds=vahYdymCywQii1ap"
  // );
  // getHotelReactLink(
  //   "https://www.agoda.com/vi-vn/region/ho-chi-minh-province-vn.html"
  // );
});
