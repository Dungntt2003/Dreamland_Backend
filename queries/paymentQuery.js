const db = require("../models/index");

const createPayment = async (paymentData) => {
  const payment = await db.ServicePayment.create(paymentData);
  return payment;
};

const checkPaymentExists = async (paymentData) => {
  const payment = await db.ServicePayment.findOne({
    where: {
      repository_id: paymentData.repository_id,
      service_id: paymentData.service_id,
    },
  });
  return payment;
};

const updatePayment = async (paymentId, paymentData) => {
  const payment = await db.ServicePayment.update(paymentData, {
    where: { id: paymentId },
  });
  return payment;
};

const getPayment = async (repository_id, service_id) => {
  const payment = await db.ServicePayment.findOne({
    where: {
      repository_id: repository_id,
      service_id: service_id,
    },
  });
  if (!payment) return null;

  let includeModel = null;
  let alias = "";

  switch (payment.service_type) {
    case "entertainment":
      includeModel = db.Entertainment;
      alias = "entertainment";
      break;
    case "hotel":
      includeModel = db.Hotel;
      alias = "hotel";
      break;
    case "restaurant":
      includeModel = db.Restaurant;
      alias = "restaurant";
      break;
    default:
      return payment;
  }
  const paymentWithService = await db.ServicePayment.findOne({
    where: {
      repository_id: repository_id,
      service_id: service_id,
    },
    include: [
      {
        model: includeModel,
        as: alias,
      },
    ],
  });

  return paymentWithService;
};

const getPaymenyByRepoId = async (repository_id) => {
  const payments = await db.ServicePayment.findAll({
    where: {
      repository_id: repository_id,
    },
  });
  return payments;
};

module.exports = {
  createPayment,
  checkPaymentExists,
  updatePayment,
  getPayment,
  getPaymenyByRepoId,
};
