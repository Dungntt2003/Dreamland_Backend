"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Entertainment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Entertainment.hasMany(models.DemoRepoDetail, {
        foreignKey: "service_id",
        as: "demoRepoDetail",
        constraints: false,
        scope: { service_type: "entertainment" },
      });
    }
  }
  Entertainment.init(
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
      price: {
        type: DataTypes.STRING,
      },
      startTime: {
        type: DataTypes.INTEGER,
      },
      endTime: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "Entertainment",
      timestamps: true,
      paranoid: false,
      modelName: "Entertainment",
    }
  );
  return Entertainment;
};
