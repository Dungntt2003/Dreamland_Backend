const db = require("../models/index");

const getListHotels = async () => {
  const hotels = await db.Hotel.findAll({
    include: [{ model: db.Room, as: "room" }],
  });

  const uniqueHotels = [];
  const seen = new Set();

  for (const hotel of hotels) {
    const key = `${hotel.name ?? ""}|${hotel.address ?? ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueHotels.push(hotel);
    }
  }

  return uniqueHotels;
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
