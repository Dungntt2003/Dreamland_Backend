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

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const earthRadius = 6371;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return Math.round(distance * 100) / 100;
};

const parseImages = (imagesString) => {
  try {
    if (!imagesString) return [];

    if (Array.isArray(imagesString)) return imagesString;

    if (typeof imagesString === "string") {
      const parsed = JSON.parse(imagesString);
      return Array.isArray(parsed) ? parsed : [];
    }

    return [];
  } catch (error) {
    console.warn("Error parsing images:", error);
    return [];
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

      const processedResults = results
        .map((item) => {
          const distance = calculateDistance(lat, lng, item.lat, item.lng);
          if (distance <= radius) {
            const itemData = { ...item.dataValues };

            if (itemData.images) {
              itemData.images = parseImages(itemData.images);
            }

            return {
              ...itemData,
              type: model.name.toLowerCase(),
              distance: distance,
              distanceUnit: "km",
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      nearbyResults.push(...processedResults);
    }

    nearbyResults.sort((a, b) => a.distance - b.distance);
    const uniqueResults = [];
    const seenDistances = new Set();

    for (const item of nearbyResults) {
      if (!seenDistances.has(item.distance)) {
        seenDistances.add(item.distance);
        uniqueResults.push(item);
      }
    }
    res.json({
      nearby: uniqueResults,
      total: uniqueResults.length,
      center: {
        lat: lat,
        lng: lng,
        radius: radius,
        radiusUnit: "km",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getNearbyLocations };
