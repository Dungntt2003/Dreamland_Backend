"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ServicePayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ServicePayment.belongsTo(models.Repository, {
        foreignKey: "repository_id",
        as: "repository",
        onDelete: "CASCADE",
        hooks: true,
      });
      ServicePayment.belongsTo(models.Entertainment, {
        foreignKey: "service_id",
        as: "entertainment",
        constraints: false,
        onDelete: "CASCADE",
        hooks: true,
      });
      ServicePayment.belongsTo(models.Hotel, {
        foreignKey: "service_id",
        as: "hotel",
        constraints: false,
        onDelete: "CASCADE",
        hooks: true,
      });
      ServicePayment.belongsTo(models.Restaurant, {
        foreignKey: "service_id",
        as: "restaurant",
        constraints: false,
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  ServicePayment.init(
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
        type: DataTypes.ENUM("hotel", "restaurant", "entertainment"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      note: {
        type: DataTypes.STRING,
      },
      result: {
        type: DataTypes.ENUM("fail", "success", "pending"),
      },
      countAdult: {
        type: DataTypes.INTEGER,
      },
      countChild: {
        type: DataTypes.INTEGER,
      },
      orderDate: {
        type: DataTypes.STRING,
      },
      subId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      timestamps: true,
      paranoid: false,
      tableName: "ServicePayment",
      modelName: "ServicePayment",
    }
  );
  return ServicePayment;
};
