"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Repository extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Repository.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
        hooks: true,
      });
      Repository.hasMany(models.DemoRepoDetail, {
        foreignKey: "repository_id",
        as: "demorepodetail",
      });
      Repository.hasMany(models.Schedule, {
        foreignKey: "repository_id",
        as: "schedule",
      });
    }
  }
  Repository.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        autoIncrement: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      numberPeople: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
        },
      },
      plan: {
        type: DataTypes.TEXT,
        get() {
          const value = this.getDataValue("plan");
          return value ? JSON.parse(value) : null;
        },
        set(value) {
          this.setDataValue("plan", JSON.stringify(value));
        },
      },
      destination: {
        type: DataTypes.STRING,
      },
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "Repository",
      timestamps: true,
      modelName: "Repository",
    }
  );
  return Repository;
};
