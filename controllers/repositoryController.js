const {
  createRepo,
  getDemoDetail,
  updateDescription,
  getRepoList,
} = require("../queries/repositoryQuery");

const getAll = async (req, res) => {
  try {
    const repoList = await getRepoList();
    res.status(200).json({
      message: "Repository list retrieved successfully",
      data: repoList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createNew = async (req, res) => {
  try {
    const repoData = req.body;
    const repo = await createRepo(repoData);
    res.status(201).json({
      message: "Repository created successfully",
      data: repo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFullDemo = async (req, res) => {
  try {
    const id = req.params.id;
    const repository = await getDemoDetail(id);
    res.status(200).json({
      message: "Repository details retrieved successfully",
      data: repository,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRepoWithDes = async (req, res) => {
  try {
    const id = req.params.id;
    const repoData = req.body;
    const updatedRepo = await updateDescription(id, repoData);
    res.status(200).json({
      message: "Repository description updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createNew, getFullDemo, updateRepoWithDes, getAll };
