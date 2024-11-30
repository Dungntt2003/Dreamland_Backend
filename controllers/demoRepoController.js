const { addNewServiceToRepo } = require("../queries/demoRepoQuery");

const addToRepo = async (req, res) => {
  try {
    const newService = await addNewServiceToRepo(req.body);
    res.status(201).json({
      message: "Service added to repository",
      data: newService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToRepo };
