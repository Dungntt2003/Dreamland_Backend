"use strict";
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
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
    const filePath = path.join(__dirname, "../crawlData/restaurant_data.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const restaurantsData = JSON.parse(rawData);

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
        phone: "0978384888",
        price: "100.000 - 300.000",
        open: 11,
        close: 22,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      restaurant.menu.forEach((food) => {
        menus.push({
          restaurant_id: restaurantId,
          name: food.itemName,
          description: `Ngon bổ rẻ`,
          image: food.image,
          price: food.price || 150000,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
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
