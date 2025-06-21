const VNP_CONFIG = require("../middlewares/vnpayMiddleware");
const {
  createPayment,
  checkPaymentExists,
  updatePayment,
  getPayment,
  getPaymenyByRepoId,
} = require("../queries/paymentQuery");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const querystring = require("querystring");

const formatDateVNPay = (date) => {
  const tzOffset = 7 * 60 * 60 * 1000;
  const local = new Date(date.getTime() + tzOffset);

  const yyyy = local.getUTCFullYear();
  const MM = String(local.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(local.getUTCDate()).padStart(2, "0");
  const hh = String(local.getUTCHours()).padStart(2, "0");
  const mm = String(local.getUTCMinutes()).padStart(2, "0");
  const ss = String(local.getUTCSeconds()).padStart(2, "0");

  return `${yyyy}${MM}${dd}${hh}${mm}${ss}`;
};

const sortObject = (obj) => {
  const sorted = {};
  const str = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(key);
    }
  }
  str.sort();
  for (let i = 0; i < str.length; i++) {
    const key = str[i];
    sorted[key] = String(obj[key]);
  }
  return sorted;
};

const createSignature = (data, secretKey) => {
  if (!secretKey) {
    throw new Error(
      "VNPay Hash Secret is required. Please check your VNP_HASH_SECRET environment variable or VNP_CONFIG.vnp_HashSecret"
    );
  }
  const hmac = crypto.createHmac("sha512", secretKey);
  hmac.update(Buffer.from(data, "utf-8"));
  return hmac.digest("hex");
};

const buildPaymentUrl = (params) => {
  const {
    vnp_Amount,
    vnp_IpAddr,
    vnp_TxnRef,
    vnp_OrderInfo,
    vnp_OrderType = "other",
    vnp_ReturnUrl = VNP_CONFIG.vnp_ReturnUrl,
    vnp_Locale = "vn",
  } = params;

  const date = new Date();
  const createDate = formatDateVNPay(date);
  const expireDate = formatDateVNPay(new Date(date.getTime() + 15 * 60 * 1000));

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: VNP_CONFIG.vnp_TmnCode,
    vnp_Locale: vnp_Locale,
    vnp_CurrCode: "VND",
    vnp_TxnRef: vnp_TxnRef,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_OrderType: vnp_OrderType,
    vnp_Amount: vnp_Amount * 100,
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_IpAddr: vnp_IpAddr,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, null, null);
  const signed = createSignature(signData, VNP_CONFIG.vnp_HashSecret);
  vnp_Params["vnp_SecureHash"] = signed;
  const paymentUrl =
    VNP_CONFIG.vnp_Url + "?" + querystring.stringify(vnp_Params, null, null);
  return paymentUrl;
};

const paymentByVnPay = (req, res) => {
  try {
    if (!VNP_CONFIG.vnp_TmnCode) {
      return res.status(500).json({
        error: "VNPay TMN Code chưa được cấu hình",
        message:
          "Vui lòng cấu hình VNP_TMN_CODE trong environment variables hoặc VNP_CONFIG",
      });
    }

    if (!VNP_CONFIG.vnp_HashSecret) {
      return res.status(500).json({
        error: "VNPay Hash Secret chưa được cấu hình",
        message:
          "Vui lòng cấu hình VNP_HASH_SECRET trong environment variables hoặc VNP_CONFIG",
      });
    }

    if (!req.body.amount || req.body.amount <= 0) {
      return res.status(400).json({
        error: "Số tiền không hợp lệ",
        message: "Vui lòng cung cấp số tiền thanh toán hợp lệ",
      });
    }

    const returnUrl = req.body?.returnUrl || VNP_CONFIG.vnp_ReturnUrl;

    const extraInfo = {
      repoId: req.body.repoId,
      serviceId: req.body.serviceId,
    };

    const vnp_IpAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip ||
      "127.0.0.1";

    const vnp_TxnRef = uuidv4().replace(/-/g, "").slice(0, 13);
    const vnp_OrderInfo = Buffer.from(JSON.stringify(extraInfo)).toString(
      "base64"
    );

    const paymentUrl = buildPaymentUrl({
      vnp_Amount: req.body.amount,
      vnp_IpAddr: vnp_IpAddr,
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_OrderType: "other",
      vnp_ReturnUrl: returnUrl,
      vnp_Locale: "vn",
    });

    return res.json({ paymentUrl });
  } catch (error) {
    console.error("VNPay payment error:", error);
    return res.status(500).json({
      error: "Có lỗi xảy ra khi tạo URL thanh toán",
      message: error.message,
    });
  }
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

const getPaymentOfRepo = async (req, res) => {
  try {
    const payment = await getPaymenyByRepoId(req.params.repoId);
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
  createNewPayment,
  checkPaymentHaveExisted,
  editPayment,
  getPaymentWithId,
  getPaymentOfRepo,
};
