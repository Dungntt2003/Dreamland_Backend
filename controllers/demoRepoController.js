const {
  addNewServiceToRepo,
  getServicesInRepo,
} = require("../queries/demoRepoQuery");

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

const getServicesData = async (req, res) => {
  try {
    const repoId = req.params.repoId;
    const services = await getServicesInRepo(repoId);
    res.json({
      message: "Services retrieved from repository",
      data: services,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToRepo, getServicesData };
