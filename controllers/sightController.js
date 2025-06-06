const {
  getAllSights,
  getSightById,
  insertSight,
} = require("../queries/sightQuery");

const getListSights = async (req, res) => {
  try {
    const sights = await getAllSights();
    res.status(200).json({
      message: "Get all sights",
      data: sights,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "something went wrong",
    });
  }
};

const getSightDetail = async (req, res) => {
  try {
    const sightId = req.params.id;
    const sight = await getSightById(sightId);
    if (!sight) {
      return res.status(404).json({
        error: "Sight not found",
      });
    }
    res.status(200).json({
      message: "Get sight detail",
      data: sight,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "something went wrong",
    });
  }
};

const createSight = async (req, res) => {
  try {
    const newData = {
      ...req.body,
      images:
        req.files.length >= 1 && req.files.length <= 5
          ? req.files.map((file) => `${file.filename}`)
          : null,
    };
    const newSight = await insertSight(newData);
    res.status(201).json({
      message: "Create new sight",
      data: newSight,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "something went wrong",
    });
  }
};

module.exports = { createSight, getListSights, getSightDetail };
