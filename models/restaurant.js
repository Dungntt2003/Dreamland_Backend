"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Restaurant.hasMany(models.Menu, {
        foreignKey: "restaurant_id",
        as: "menu",
      });
      Restaurant.hasMany(models.DemoRepoDetail, {
        foreignKey: "service_id",
        as: "demoRepoDetail",
        constraints: false,
        scope: { service_type: "restaurant" },
      });
      Restaurant.hasMany(models.Schedule, {
        foreignKey: "service_id",
        as: "schedule",
        constraints: false,
        scope: { service_type: "restaurant" },
      });
    }
  }
  Restaurant.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT("long"),
      },
      phone: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.STRING,
      },
      video: {
        type: DataTypes.STRING,
      },
      open: {
        type: DataTypes.INTEGER,
      },
      close: {
        type: DataTypes.INTEGER,
      },
      rate: {
        type: DataTypes.INTEGER,
      },
      images: {
        type: DataTypes.TEXT,
        get() {
          const rawValue = this.getDataValue("images");
          return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
          this.setDataValue("images", JSON.stringify(value));
        },
      },
    },
    {
      sequelize,
      tableName: "Restaurant",
      timestamps: true,
      paranoid: false,
      modelName: "Restaurant",
    }
  );
  return Restaurant;
};
