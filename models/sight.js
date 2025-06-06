"use strict";

const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sight.hasMany(models.DemoRepoDetail, {
        foreignKey: "service_id",
        as: "demoRepoDetail",
        constraints: false,
        scope: { service_type: "sight" },
      });
      Sight.hasMany(models.Schedule, {
        foreignKey: "service_id",
        as: "schedule",
        constraints: false,
        scope: { service_type: "sight" },
      });
    }
  }
  Sight.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        autoIncrement: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      images: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("images");
          return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
          this.setDataValue("images", JSON.stringify(value));
        },
      },
      startTime: {
        type: DataTypes.INTEGER,
      },
      endTime: {
        type: DataTypes.INTEGER,
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
    },
    {
      sequelize,
      tableName: "Sight",
      timestamps: true,
      paranoid: false,
      modelName: "Sight",
    }
  );
  Sight.beforeCreate(async (sight, options) => {
    const maxId = await Sight.max("id", {
      where: {
        id: {
          [Op.like]: "SI%",
        },
      },
    });
    const nextId =
      maxId && maxId.match(/SI(\d+)/)
        ? parseInt(maxId.match(/SI(\d+)/)[1], 10) + 1
        : 1;

    sight.id = `SI${nextId.toString().padStart(2, "0")}`;
  });
  return Sight;
};
