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

    const filePath = path.join(__dirname, "../crawlData/hotel_data.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const hotelsData = JSON.parse(rawData);

    let hotels = [];
    let rooms = [];
    hotelsData.forEach((hotel) => {
      const hotelId = uuidv4();

      hotels.push({
        id: hotelId,
        name: hotel.name,
        address: hotel.address,
        images: JSON.stringify(hotel.images),
        description: `Tiện ích: ${hotel.services};Giới thiệu chi tiết: " "`,
        checkin: 14,
        checkout: 12,
        near_location: "",
      });

      hotel.roomInfo.forEach((room) => {
        rooms.push({
          hotel_id: hotelId,
          name: room.roomName,
          description: `"haha"`,
          image: room.mainImage,
          price: 1200000,
        });
      });
    });

    await queryInterface.bulkInsert("Hotel", hotels, {});
    await queryInterface.bulkInsert("Room", rooms, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Room", null, {});
    await queryInterface.bulkDelete("Hotel", null, {});
  },
};
