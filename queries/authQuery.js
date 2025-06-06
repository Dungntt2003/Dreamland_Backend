const { where } = require("sequelize");
const db = require("../models/index");
const createUser = async (userData) => {
  try {
    const existingUser = await db.User.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      return {
        message: "Email đã tồn tại",
      };
    }

    const user = await db.User.create(userData);
    return user;
  } catch (error) {
    throw error;
  }
};

const checkUserExist = async (userData) => {
  const existedUser = await db.User.findOne({
    where: { email: userData.email },
  });
  return existedUser;
};

module.exports = { createUser, checkUserExist };
