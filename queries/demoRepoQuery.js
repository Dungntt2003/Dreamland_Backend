const db = require("../models/index");
const addNewServiceToRepo = async (serviceData) => {
  const demoService = await db.DemoRepoDetail.create(serviceData);
  return demoService;
};

const removeServiceFromRepo = async (serviceData, repoId) => {
  const { service_id, service_type } = serviceData;
  const deletedService = await db.DemoRepoDetail.destroy({
    where: {
      service_id: service_id,
      service_type: service_type,
      repository_id: repoId,
    },
  });
  return deletedService;
};

const getServicesInRepo = async (repoId) => {
  const servicesData = await db.DemoRepoDetail.findAll({
    where: { repository_id: repoId },
    include: [
      {
        model: db.Sight,
        as: "sight",
        attributes: ["name"],
      },
      {
        model: db.Entertainment,
        as: "entertainment",
        attributes: ["name"],
      },
      {
        model: db.Hotel,
        as: "hotel",
        attributes: ["name"],
      },
      {
        model: db.Restaurant,
        as: "restaurant",
        attributes: ["name"],
      },
    ],
    order: [
      [
        db.sequelize.literal(`
          FIELD(service_type, 'sight', 'entertainment', 'hotel', 'restaurant')
        `),
        "ASC",
      ],
    ],
  });

  return servicesData;
};

module.exports = {
  addNewServiceToRepo,
  getServicesInRepo,
  removeServiceFromRepo,
};
