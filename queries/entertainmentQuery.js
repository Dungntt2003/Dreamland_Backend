const db = require("../models/index");
const getAllEnters = async () => {
  const enters = await db.Entertainment.findAll();
  return enters;
};

const getEnterById = async (id) => {
  const enter = await db.Entertainment.findByPk(id);
  return enter;
};

const insertEnter = async (enterData) => {
  const enter = await db.Entertainment.create(enterData);
  return enter;
};

module.exports = { getAllEnters, getEnterById, insertEnter };
