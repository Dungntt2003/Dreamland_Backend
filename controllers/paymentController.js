const vnpay = require("../middlewares/vnpayMiddleware");
const { ProductCode, VnpLocale } = require("vnpay");
const {
  createPayment,
  checkPaymentExists,
  updatePayment,
  getPayment,
} = require("../queries/paymentQuery");
const { v4: uuidv4 } = require("uuid");

const paymentByVnPay = (req, res) => {
  const returnUrl =
    req.body?.returnUrl || "http://localhost:3000/api/v1/payment/vnpay-return";

  const extraInfo = {
    repoId: req.body.repoId,
    serviceId: req.body.serviceId,
  };

  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: req.body.amount,
    vnp_IpAddr:
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip,
    vnp_TxnRef: uuidv4().replace(/-/g, "").slice(0, 13),
    vnp_OrderInfo: Buffer.from(JSON.stringify(extraInfo)).toString("base64"),
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: returnUrl,
    vnp_Locale: VnpLocale.VN,
  });

  return res.json({ paymentUrl });
};

const paymentReturn = (req, res) => {
  let verify = {};
  try {
    verify = vnpay.verifyReturnUrl(req.query);
    if (!verify.isVerified) {
      return res.send("Xác thực tính toàn vẹn dữ liệu không thành công");
    }
    if (!verify.isSuccess) {
      return res.send("Đơn hàng thanh toán không thành công");
    }
  } catch (error) {
    return res.send("Dữ liệu không hợp lệ");
  }

  return res.send("Xác thực URL trả về thành công");
};

const createNewPayment = async (req, res) => {
  try {
    const payment = await createPayment(req.body);
    res.status(200).json({
      message: "Create payment successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Create payment failed",
      error: error.message,
    });
  }
};

const checkPaymentHaveExisted = async (req, res) => {
  try {
    const payment = await checkPaymentExists(req.body);
    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }
    res.status(200).json({
      message: "Check payment successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const editPayment = async (req, res) => {
  try {
    const payment = await updatePayment(req.params.id, req.body);
    res.status(200).json({
      message: "Update payment successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPaymentWithId = async (req, res) => {
  try {
    const payment = await getPayment(req.params.repoId, req.params.serviceId);
    res.status(200).json({
      message: "Get payment successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  paymentByVnPay,
  paymentReturn,
  createNewPayment,
  checkPaymentHaveExisted,
  editPayment,
  getPaymentWithId,
};
