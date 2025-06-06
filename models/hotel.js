"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hotel.hasMany(models.Room, { foreignKey: "hotel_id", as: "room" });
      Hotel.hasMany(models.DemoRepoDetail, {
        foreignKey: "service_id",
        as: "demoRepoDetail",
        constraints: false,
        scope: { service_type: "hotel" },
      });
      Hotel.hasMany(models.Schedule, {
        foreignKey: "service_id",
        as: "schedule",
        constraints: false,
        scope: { service_type: "hotel" },
      });
    }
  }
  Hotel.init(
    {
      id: {
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      address: {
        type: DataTypes.STRING,
      },
      checkin: {
        type: DataTypes.INTEGER,
      },
      checkout: {
        type: DataTypes.INTEGER,
      },
      near_location: {
        type: DataTypes.TEXT,
      },
      rate: {
        type: DataTypes.INTEGER,
      },
      lat: {
        type: DataTypes.FLOAT,
      },
      lng: {
        type: DataTypes.FLOAT,
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
      timestamps: true,
      paranoid: false,
      tableName: "Hotel",
      modelName: "Hotel",
    }
  );
  return Hotel;
};
