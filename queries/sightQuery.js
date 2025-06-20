const db = require("../models/index");

const getAllSights = async () => {
  const sights = await db.Sight.findAll();

  const uniqueSights = [];
  const seen = new Set();

  for (const sight of sights) {
    const key = `${sight.name}|${sight.address}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSights.push(sight);
    }
  }

  return uniqueSights;
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
