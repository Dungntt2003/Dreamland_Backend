const geocoder = require("../middlewares/mapMiddleware");
const db = require("../models/index");
async function getCoordinatesFromAddress(address) {
  try {
    const res = await geocoder.geocode(address);
    if (res.length > 0) {
      return {
        lat: res[0].latitude,
        lng: res[0].longitude,
      };
    }
  } catch (err) {
    console.error("Error fetching coordinates:", err.message);
  }
  return null;
}

async function updateSightWithCoordinates(sight) {
  const coords = await getCoordinatesFromAddress(sight.address);
  if (coords) {
    sight.lat = coords.lat;
    sight.lng = coords.lng;
    await sight.save();
  }
}

async function updateAllSights() {
  const sights = await db.Restaurant.findAll({
    where: {
      lat: null,
      lng: null,
    },
  });

  for (const sight of sights) {
    await updateSightWithCoordinates(sight);
  }
}

async function updateRandomCoordinatesForSights() {
  const sights = await db.Restaurant.findAll({
    where: {
      lat: null,
      lng: null,
    },
  });

  for (const sight of sights) {
    const randomLat = getRandomInRange(8.0, 23.5);
    const randomLng = getRandomInRange(102.0, 109.5);

    sight.lat = randomLat;
    sight.lng = randomLng;
    await sight.save();

    console.log(`Updated ${sight.name}: lat=${randomLat}, lng=${randomLng}`);
  }
}

function getRandomInRange(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(6));
}

module.exports = updateRandomCoordinatesForSights;
