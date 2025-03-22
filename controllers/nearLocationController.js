const { Op } = require("sequelize");
const db = require("../models/index");

const getModelByType = (type) => {
  switch (type) {
    case "sight":
      return db.Sight;
    case "entertainment":
      return db.Entertainment;
    case "hotel":
      return db.Hotel;
    case "restaurant":
      return db.Restaurant;
    default:
      return null;
  }
};

const getNearbyLocations = async (req, res) => {
  try {
    const { type, id, radius = 5 } = req.query;
    const selectedModel = getModelByType(type);

    if (!selectedModel) return res.status(400).json({ error: "Invalid type" });

    const selected = await selectedModel.findByPk(id);
    if (!selected || !selected.lat || !selected.lng) {
      return res
        .status(404)
        .json({ error: "Location not found or missing coordinates" });
    }

    const { lat, lng } = selected;
    const earthRadius = 6371;

    const allModels = [db.Sight, db.Entertainment, db.Hotel, db.Restaurant];

    const nearbyResults = [];

    for (const model of allModels) {
      const results = await model.findAll({
        where: {
          id: { [Op.not]: id },
          lat: { [Op.ne]: null },
          lng: { [Op.ne]: null },
        },
      });

      // Tính khoảng cách theo công thức Haversine
      const filtered = results.filter((item) => {
        const dLat = (item.lat - lat) * (Math.PI / 180);
        const dLng = (item.lng - lng) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat * (Math.PI / 180)) *
            Math.cos(item.lat * (Math.PI / 180)) *
            Math.sin(dLng / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance <= radius;
      });

      filtered.forEach((item) => {
        item.dataValues.type = model.name.toLowerCase();
      });

      nearbyResults.push(...filtered);
    }

    res.json({ nearby: nearbyResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getNearbyLocations };
