"use strict";
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { getRandomRoomPrice } = require("../utils/getRandomPrice");
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

    const filePath = path.join(__dirname, "../crawlData/hotels_p2.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const hotelsData = JSON.parse(rawData);

    const filePath2 = path.join(__dirname, "../crawlData/hotels.json");
    const rawData2 = fs.readFileSync(filePath2, "utf8");
    const hotelsData2 = JSON.parse(rawData2);

    let hotels = [];
    let rooms = [];
    hotelsData.forEach((hotel) => {
      const hotelId = uuidv4();

      hotels.push({
        id: hotelId,
        name: hotel.name,
        address: hotel.address,
        images: JSON.stringify(hotel.images),
        description: `Tiện ích: ${hotel.services}\n;Giới thiệu chi tiết: ${hotel.description}`,
        checkin: 14,
        checkout: 12,
        near_location: "",
      });

      hotel.roomInfo.forEach((room) => {
        rooms.push({
          hotel_id: hotelId,
          name: room.roomName,
          description: `${room.description}, ${room.roomType}, ${room.peopleCapacity}, ${room.bedCount}, ${room.roomSize}, ${room.roomDirection}`,
          image: room.mainImage,
          price: getRandomRoomPrice(),
        });
      });
    });

    hotelsData2.forEach((hotel) => {
      const hotelId = uuidv4();

      hotels.push({
        id: hotelId,
        name: hotel.name,
        address: hotel.address,
        images: JSON.stringify(hotel.imageUrls),
        description: hotel.facilities.join("\n"),
        checkin: 14,
        checkout: 12,
        near_location: "",
      });

      hotel.rooms.forEach((room) => {
        rooms.push({
          hotel_id: hotelId,
          name: room.name,
          description: `${room.area}\n${room.capacity}\n${room.view}, ${room.bed}`,
          image: room.image,
          price: getRandomRoomPrice(),
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
