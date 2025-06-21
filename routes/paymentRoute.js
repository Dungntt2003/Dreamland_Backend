const express = require("express");
const route = express.Router();
const {
  paymentByVnPay,
  createNewPayment,
  checkPaymentHaveExisted,
  editPayment,
  getPaymentWithId,
  getPaymentOfRepo,
} = require("../controllers/paymentController");

const authenticateToken = require("../middlewares/authMiddleware");

route.post("/create-payment", paymentByVnPay);
route.post("/create", authenticateToken, createNewPayment);
route.post("/check-exist", authenticateToken, checkPaymentHaveExisted);
route.put("/:id", authenticateToken, editPayment);
route.get("/:repoId", authenticateToken, getPaymentOfRepo);
route.get("/:repoId/:serviceId", authenticateToken, getPaymentWithId);

module.exports = route;
