const db = require("./models/index");
const updateCoordinatesForModel = require("./utils/getLat");
const updateRatingForModel = require("./utils/getRating");

async function main() {
  try {
    await updateRatingForModel(db.Sight);
    await updateRatingForModel(db.Restaurant);
    await updateRatingForModel(db.Hotel);
    await updateRatingForModel(db.Entertainment);

    await updateCoordinatesForModel(db.Sight);
    await updateCoordinatesForModel(db.Restaurant);
    await updateCoordinatesForModel(db.Hotel);
    await updateCoordinatesForModel(db.Entertainment);

    console.log("Done updating ratings and coordinates!");
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

main();
