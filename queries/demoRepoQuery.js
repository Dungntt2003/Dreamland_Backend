const db = require("../models/index");

const addNewServiceToRepo = async (serviceData) => {
  const demoService = await db.DemoRepoDetail.create(serviceData);
  return demoService;
};

module.exports = { addNewServiceToRepo };
