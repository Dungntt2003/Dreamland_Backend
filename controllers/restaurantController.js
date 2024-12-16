const {
  getRestaurantById,
  getRestaurants,
  createRestaurant,
  insertDish,
} = require("../queries/restaurantQuery");

const getList = async (req, res) => {
  try {
    const restaurants = await getRestaurants();
    res.status(200).json({
      message: "Get list of restaurants",
      data: restaurants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getDetail = async (req, res) => {
  try {
    const restaurant = await getRestaurantById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json({
      message: "Get restaurant detail",
      data: restaurant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const insertRes = async (req, res) => {
  try {
    const newData = {
      ...req.body,
      images:
        req.files.length >= 1 && req.files.length <= 5
          ? req.files.map((file) => `${file.filename}`)
          : null,
    };
    const newRestaurant = await createRestaurant(newData);
    res.status(201).json({
      message: "Create new entertainment",
      data: newRestaurant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const insertNewDish = async (req, res) => {
  try {
    const dishData = {
      ...req.body,
      image: req.file ? req.file.filename : null,
    };
    const newDish = await insertDish(dishData);
    res.status(201).json({
      message: "Create new dish",
      data: newDish,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDetail, getList, insertRes, insertNewDish };
