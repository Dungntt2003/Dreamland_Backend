const { where } = require("sequelize");
const db = require("../models/index");

const getRepoList = async () => {
  const repoList = await db.Repository.findAll();
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

module.exports = { createRepo, getDemoDetail, updateDescription, getRepoList };
