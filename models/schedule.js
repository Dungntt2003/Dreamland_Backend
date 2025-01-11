"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Repository, {
        foreignKey: "repository_id",
        as: "repository",
        onDelete: "CASCADE",
        hooks: true,
      });
      Schedule.belongsTo(models.Sight, {
        foreignKey: "service_id",
        as: "sight",
        constraints: false,
        onDelete: "CASCADE",
        hooks: true,
      });
      Schedule.belongsTo(models.Entertainment, {
        foreignKey: "service_id",
        as: "entertainment",
        constraints: false,
        onDelete: "CASCADE",
        hooks: true,
      });
      Schedule.belongsTo(models.Hotel, {
        foreignKey: "service_id",
        as: "hotel",
        constraints: false,
        onDelete: "CASCADE",
        hooks: true,
      });
      Schedule.belongsTo(models.Restaurant, {
        foreignKey: "service_id",
        as: "restaurant",
        constraints: false,
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Schedule.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        autoIncrement: false,
      },
      repository_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      service_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      service_type: {
        type: DataTypes.ENUM("sight", "hotel", "restaurant", "entertainment"),
        allowNull: false,
      },
      start: {
        type: DataTypes.DATE,
      },
      end: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: "Schedule",
      timestamps: true,
      paranoid: false,
      modelName: "Schedule",
    }
  );
  return Schedule;
};
