const db = require("../models/index");

const getRestaurants = async () => {
  const restaurants = await db.Restaurant.findAll();
  return restaurants;
};

const getRestaurantById = async (id) => {
  const restaurant = await db.Restaurant.findByPk(id, {
    include: [
      {
        model: db.Menu,
        as: "menu",
      },
    ],
  });
  return restaurant;
};

const createRestaurant = async (restaurantData) => {
  const restaurant = await db.Restaurant.create(restaurantData);
  return restaurant;
};

const insertDish = async (dishData) => {
  const dish = await db.Menu.create(dishData);
  return dish;
};

module.exports = {
  getRestaurantById,
  getRestaurants,
  createRestaurant,
  insertDish,
};
