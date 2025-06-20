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

const updateAva = async (id, ava) => {
  const [count] = await db.User.update(
    { ava: ava },
    {
      where: { id: id },
    }
  );
  return count;
};

const updateUser = async (id, userData) => {
  const [count] = await db.User.update(userData, {
    where: { id: id },
  });
  return count;
};

const updatePass = async (id, newPass) => {
  const [count] = await db.User.update(
    { password: newPass },
    {
      where: { id: id },
    }
  );
  return count;
};

module.exports = { updateUser, getUser, updateAva, updatePass };
