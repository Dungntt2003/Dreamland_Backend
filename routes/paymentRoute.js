const express = require("express");
const route = express.Router();
const {
  paymentByVnPay,
  paymentReturn,
} = require("../controllers/paymentController");

route.post("/create-payment", paymentByVnPay);
route.get("/vnpay-return", paymentReturn);

module.exports = route;
