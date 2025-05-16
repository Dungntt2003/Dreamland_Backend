const geocoder = require("../middlewares/mapMiddleware");

function getRandomInRange(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(6));
}

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

async function updateCoordinatesForModel(model) {
  const records = await model.findAll({
    where: {
      lat: null,
      lng: null,
    },
  });

  for (const record of records) {
    let coords = null;

    if (record.address) {
      coords = await getCoordinatesFromAddress(record.address);
    }
    if (!coords) {
      coords = {
        lat: getRandomInRange(8.0, 23.5),
        lng: getRandomInRange(102.0, 109.5),
      };
      console.log(
        `Randomed ${record.name}: lat=${coords.lat}, lng=${coords.lng}`
      );
    } else {
      console.log(
        `Geocoded ${record.name}: lat=${coords.lat}, lng=${coords.lng}`
      );
    }

    record.lat = coords.lat;
    record.lng = coords.lng;
    await record.save();
  }
}

module.exports = updateCoordinatesForModel;
