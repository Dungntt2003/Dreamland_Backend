const db = require("../models/index");

const getRestaurants = async () => {
  const restaurants = await db.Restaurant.findAll({});

  const uniqueRestaurants = [];
  const seen = new Set();

  for (const restaurant of restaurants) {
    const key = `${restaurant.name ?? ""}|${restaurant.address ?? ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRestaurants.push(restaurant);
    }
  }

  return uniqueRestaurants;
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
