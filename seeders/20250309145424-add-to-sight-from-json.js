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
    const filePath = path.join(__dirname, "../crawlData/travel_data.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const sights = JSON.parse(rawData);
    const formattedSights = sights.map((place) => ({
      id: uuidv4(),
      name: place.title,
      address: `${place.title}, ${place.province}`,
      images: JSON.stringify(place.images || []),
      startTime: 0,
      endTime: 24,
      // createdAt: new Date(),
      // updatedAt: new Date(),
      description: place.description,
    }));
    await queryInterface.bulkInsert("Sight", formattedSights);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Sight", null, {});
  },
};
