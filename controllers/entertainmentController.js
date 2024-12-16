const {
  getAllEnters,
  getEnterById,
  insertEnter,
} = require("../queries/entertainmentQuery");

const getListEnters = async (req, res) => {
  try {
    const entertainments = await getAllEnters();
    res.status(200).json({
      message: "Get all entertainments",
      data: entertainments,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

const getEnterDetail = async (req, res) => {
  try {
    const enterId = req.params.id;
    const enter = await getEnterById(enterId);
    if (!enter) {
      return res.status(404).json({
        message: "Entertainment not found",
      });
    }
    res.status(200).json({
      message: "Get entertainment detail",
      data: enter,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

const createNewEnter = async (req, res) => {
  try {
    const newData = {
      ...req.body,
      images:
        req.files.length >= 1 && req.files.length <= 5
          ? req.files.map((file) => `${file.filename}`)
          : null,
    };
    const newEnter = await insertEnter(newData);
    res.status(201).json({
      message: "Create new entertainment",
      data: newEnter,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
module.exports = { createNewEnter, getListEnters, getEnterDetail };
