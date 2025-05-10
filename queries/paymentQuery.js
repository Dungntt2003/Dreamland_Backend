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

module.exports = { createPayment, checkPaymentExists, updatePayment };
