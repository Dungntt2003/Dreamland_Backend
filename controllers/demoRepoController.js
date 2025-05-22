const {
  addNewServiceToRepo,
  getServicesInRepo,
  removeServiceFromRepo,
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
const removeFromRepo = async (req, res) => {
  try {
    const { service_id, service_type, repo_id } = req.query;

    if (!service_id || !service_type || !repo_id) {
      return res
        .status(400)
        .json({ message: "Missing required query parameters" });
    }

    const deletedService = await removeServiceFromRepo(
      { service_id, service_type },
      repo_id
    );

    if (deletedService) {
      res.status(200).json({
        message: "Service removed from repository",
        data: deletedService,
      });
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {
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

module.exports = { addToRepo, getServicesData, removeFromRepo };
