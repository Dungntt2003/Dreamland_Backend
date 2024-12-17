const db = require("../models/index");

const getListHotels = async () => {
  const hotels = await db.Hotel.findAll();
  return hotels;
};

const getHotel = async (id) => {
  const hotel = await db.Hotel.findByPk(id, {
    include: [{ model: db.Room, as: "room" }],
  });
  return hotel;
};

const createHotel = async (hotelData) => {
  const hotel = await db.Hotel.create(hotelData);
  return hotel;
};

const createARoom = async (roomData) => {
  const room = await db.Room.create(roomData);
  return room;
};
module.exports = { getListHotels, getHotel, createHotel, createARoom };
