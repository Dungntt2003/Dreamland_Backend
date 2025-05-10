const express = require("express");
const route = express.Router();
const {
  paymentByVnPay,
  paymentReturn,
  createNewPayment,
  checkPaymentHaveExisted,
  editPayment,
} = require("../controllers/paymentController");

const authenticateToken = require("../middlewares/authMiddleware");

route.post("/create-payment", paymentByVnPay);
route.get("/vnpay-return", paymentReturn);
route.post("/create", authenticateToken, createNewPayment);
route.post("/check-exist", authenticateToken, checkPaymentHaveExisted);
route.put("/:id", authenticateToken, editPayment);

module.exports = route;
