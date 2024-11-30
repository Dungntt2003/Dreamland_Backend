"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DemoRepoDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DemoRepoDetail.belongsTo(models.Repository, {
        foreignKey: "repository_id",
        as: "repository",
        onDelete: "CASCADE",
        hooks: true,
      });
      DemoRepoDetail.belongsTo(models.Sight, {
        foreignKey: "service_id",
        as: "sight",
        constraints: false,
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  DemoRepoDetail.init(
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
    },
    {
      sequelize,
      tableName: "DemoRepoDetail",
      timestamps: true,
      paranoid: false,
      modelName: "DemoRepoDetail",
    }
  );
  return DemoRepoDetail;
};
