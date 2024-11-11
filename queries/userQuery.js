const { where } = require("sequelize");
const db = require("../models/index");

const getUser = async (id) => {
  const user = await db.User.findByPk(id, {
    attributes: {
      exclude: ["password"],
    },
  });
  return user;
};

const updateUser = async (id, userData) => {
  // console.log(userData);
  const [count] = await db.User.update(userData, {
    where: { id: id },
  });
  // console.log(count);
  return count;
};

module.exports = { updateUser, getUser };
