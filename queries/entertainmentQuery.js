const db = require("../models/index");
const getAllEnters = async () => {
  const entertainments = await db.Entertainment.findAll();

  const uniqueEnters = [];
  const seen = new Set();

  for (const enter of entertainments) {
    const key = `${enter.name}|${enter.address}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueEnters.push(enter);
    }
  }

  return uniqueEnters;
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
