"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const regularExpression =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [9, 11],
            message: "Số điện thoại phải có từ 9 đến 11 chữ số",
          },
          is: {
            args: /^[0-9]+$/,
            msg: "Số điện thoại chỉ gồm chữ số",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email đã tồn tại",
        },
        validate: {
          isEmail: {
            msg: "Email không hợp lệ",
          },
          notNull: {
            msg: "Email không được để trống",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: regularExpression,
            msg: "Mật khẩu phải từ 6 đến 16 ký tự, phải có ít nhất một chữ số và một ký tự đặc biệt",
          },
          notNull: {
            msg: "Mật khẩu không được để trống",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [
            ["user", "admin", "hotel_admin", "restaurant_admin", "food_admin"],
          ],
        },
      },
      business_info_front: {
        type: DataTypes.TEXT,
      },
      business_info_end: {
        type: DataTypes.TEXT,
      },
      ava: {
        type: DataTypes.TEXT,
      },
      business_type: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "user",
      timestamps: true,
      paranoid: true,
    }
  );

  User.addHook("beforeCreate", async (user) => {
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
  });
  User.addHook("beforeUpdate", async (user) => {
    if (user.changed("password")) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(user.password, saltRounds);
    }
  });
  return User;
};
