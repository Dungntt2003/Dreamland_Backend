const db = require("../models/index");

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

module.exports = { createRepo, getDemoDetail };
