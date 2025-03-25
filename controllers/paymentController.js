const vnpay = require("../middlewares/vnpayMiddleware");
const { ProductCode, VnpLocale } = require("vnpay");
const { v4: uuidv4 } = require("uuid");
const paymentByVnPay = (req, res) => {
  const returnUrl =
    req.body?.returnUrl || "http://localhost:3000/api/v1/payment/vnpay-return";

  // Tạo URL thanh toán
  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: 100000,
    vnp_IpAddr:
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip,
    vnp_TxnRef: uuidv4().replace(/-/g, "").slice(0, 13),
    vnp_OrderInfo: "Thanh toan don hang 123456",
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

module.exports = { paymentByVnPay, paymentReturn };
