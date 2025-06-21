require("dotenv").config();

const VNP_CONFIG = {
  vnp_TmnCode: process.env.VNP_TMNCODE,
  vnp_HashSecret: process.env.VNP_HASHSECRET,
  vnp_Url: process.env.VNP_URL,
  vnp_Api: process.env.VNP_API,
  vnp_ReturnUrl: `${process.env.BASE_URL}${process.env.VNP_RETURN_PATH}`,
};

module.exports = VNP_CONFIG;
