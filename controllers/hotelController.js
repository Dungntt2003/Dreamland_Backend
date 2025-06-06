const {
  createHotel,
  getHotel,
  getListHotels,
  createARoom,
} = require("../queries/hotelQuery");

const getHotels = async (req, res) => {
  try {
    const hotels = await getListHotels();
    res.status(200).json({
      message: "Get list hotels",
      data: hotels,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getDetail = async (req, res) => {
  try {
    const hotel = await getHotel(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json({
      message: "Get hotel detail",
      data: hotel,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const createNew = async (req, res) => {
  try {
    const newData = {
      ...req.body,
      images:
        req.files && req.files.length >= 1 && req.files.length <= 5
          ? req.files.map((file) => `${file.filename}`)
          : null,
    };
    const hotel = await createHotel(newData);
    res.status(201).json({
      message: "Create hotel successfully",
      data: hotel,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const createNewRoom = async (req, res) => {
  try {
    const roomData = {
      ...req.body,
      image: req.file ? req.file.filename : null,
    };
    const room = await createARoom(roomData);
    res.status(201).json({
      message: "Create room successfully",
      data: room,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getHotels, getDetail, createNew, createNewRoom };
