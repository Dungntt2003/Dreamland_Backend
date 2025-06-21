const { where } = require("sequelize");
const db = require("../models/index");

const getRepoList = async (userId) => {
  const repoList = await db.Repository.findAll({
    where: {
      user_id: userId,
    },
  });
  return repoList;
};

const createRepo = async (repoData) => {
  const repo = await db.Repository.create(repoData);
  return repo;
};

const getDemoDetail = async (id) => {
  const repository = await db.Repository.findOne({
    where: { id: id },
    include: [
      {
        model: db.DemoRepoDetail,
        as: "demorepodetail",
      },
      {
        model: db.ServicePayment,
        as: "servicepayment",
      },
    ],
  });
  return repository;
};

const updateDescription = async (id, repoData) => {
  const updatedRepo = await db.Repository.update(repoData, {
    where: { id: id },
  });
  return updatedRepo;
};

const updateStatus = async (id) => {
  try {
    const repo = await db.Repository.findByPk(id);
    if (!repo) {
      throw new Error("Repo not found");
    }

    repo.isHidden = !repo.isHidden;
    await repo.save();
    return repo;
  } catch (error) {
    console.error("Failed to update status:", error);
    throw error;
  }
};

const deleteRepo = async (id) => {
  const deletedCount = await db.Repository.destroy({
    where: { id },
  });
  return deletedCount;
};

module.exports = {
  createRepo,
  getDemoDetail,
  updateDescription,
  getRepoList,
  updateStatus,
  deleteRepo,
};
