"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Menu.belongsTo(models.Restaurant, {
        foreignKey: "restaurant_id",
        as: "restaurant",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Menu.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      restaurant_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      image: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "Menus",
      paranoid: false,
      timestamps: true,
      modelName: "Menu",
    }
  );
  return Menu;
};
