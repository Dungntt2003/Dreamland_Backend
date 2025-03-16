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
    const filePath = path.join(
      __dirname,
      "../crawlData/entertainment_data.json"
    );
    const rawData = fs.readFileSync(filePath, "utf8");
    const entertainments = JSON.parse(rawData);
    const formattedEnters = entertainments.map((place) => ({
      id: uuidv4(),
      name: place.placeName,
      address: place.address,
      images: JSON.stringify(place.images || []),
      price: place.price,
      startTime: 0,
      endTime: 24,
      description: place.services.join(", "),
    }));
    await queryInterface.bulkInsert("Entertainment", formattedEnters);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Entertainment", null, {});
  },
};
