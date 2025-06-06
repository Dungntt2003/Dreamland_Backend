const { addItem, getSchedule } = require("../queries/scheduleQuery");

const addItemToSchedule = async (req, res) => {
  try {
    const newItem = await addItem(req.body);
    res.status(200).json({
      message: "Item added to schedule",
      data: newItem,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getScheduleByRepoId = async (req, res) => {
  try {
    const repoId = req.params.repoId;
    const schedule = await getSchedule(repoId);
    res.json({
      message: "Schedule retrieved",
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { addItemToSchedule, getScheduleByRepoId };
