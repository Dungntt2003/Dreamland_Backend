const db = require("../models/index");

const addItem = async (itemData) => {
  const newItem = await db.Schedule.create(itemData);
  return newItem;
};

const getSchedule = async (repoId) => {
  const scheduleData = await db.Schedule.findAll({
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

  return scheduleData;
};

module.exports = { addItem, getSchedule };
