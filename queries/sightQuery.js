const db = require("../models/index");
const getAllSights = async () => {
  const sights = await db.Sight.findAll();
  return sights;
};

const getSightById = async (id) => {
  const sight = await db.Sight.findByPk(id);
  return sight;
};

const insertSight = async (sightData) => {
  const sight = await db.Sight.create(sightData);
  return sight;
};

module.exports = { getAllSights, getSightById, insertSight };
