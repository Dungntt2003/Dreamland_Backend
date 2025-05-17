"use strict";
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {
  getRandomPriceRange,
  getRandomPhoneNumber,
  getRandomMenuPrice,
  generateDishDescription,
} = require("../utils/getRandomPrice");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const filePath = path.join(__dirname, "../crawlData/restaurants_p2.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const restaurantsData = JSON.parse(rawData);

    const filePath2 = path.join(__dirname, "../crawlData/restaurants.json");
    const rawData2 = fs.readFileSync(filePath2, "utf8");
    const restaurantsData2 = JSON.parse(rawData2);

    let restaurants = [];
    let menus = [];
    restaurantsData.forEach((restaurant) => {
      const restaurantId = uuidv4();

      restaurants.push({
        id: restaurantId,
        name: restaurant.name,
        video: restaurant.video,
        address: restaurant.address,
        images: JSON.stringify(restaurant.images),
        description: `${restaurant.descriptionText}\n${restaurant.time}`,
        phone: getRandomPhoneNumber(),
        price: getRandomPriceRange(),
        open: 11,
        close: 22,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      restaurant.menu.forEach((food) => {
        menus.push({
          restaurant_id: restaurantId,
          name: food.itemName,
          description: generateDishDescription(food.itemName),
          image: food.image,
          price: getRandomMenuPrice(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    restaurantsData2.forEach((restaurant) => {
      const restaurantId = uuidv4();

      restaurants.push({
        id: restaurantId,
        name: restaurant.name,
        video: "",
        address: restaurant.address,
        images: JSON.stringify([
          ...restaurant.imageUrls,
          ...restaurant.imgMenu,
        ]),
        description: restaurant.utilities.join("\n"),
        phone: getRandomPhoneNumber(),
        price: restaurant.priceRange,
        open: 10,
        close: 23,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    await queryInterface.bulkInsert("Restaurant", restaurants, {});
    await queryInterface.bulkInsert("Menus", menus, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Restaurant", null, {});
    await queryInterface.bulkDelete("Menus", null, {});
  },
};
