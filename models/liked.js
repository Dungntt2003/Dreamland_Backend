"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Liked extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Liked.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
        hooks: true,
      });
      Liked.belongsTo(models.Sight, {
        foreignKey: "service_id",
        as: "sight",
        constraints: false,
        onDelete: "CASCADE",
        hooks: true,
      });
      Liked.belongsTo(models.Entertainment, {
        foreignKey: "service_id",
        as: "entertainment",
        constraints: false,
        onDelete: "CASCADE",
        hooks: true,
      });
      Liked.belongsTo(models.Hotel, {
        foreignKey: "service_id",
        as: "hotel",
        constraints: false,
        onDelete: "CASCADE",
        hooks: true,
      });
      Liked.belongsTo(models.Restaurant, {
        foreignKey: "service_id",
        as: "restaurant",
        constraints: false,
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Liked.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      service_id: {
        type: DataTypes.STRING,
      },
      service_type: {
        type: DataTypes.ENUM("sight", "hotel", "restaurant", "entertainment"),
      },
    },
    {
      sequelize,
      timestamps: true,
      paranoid: false,
      tableName: "Liked",
      modelName: "Liked",
    }
  );
  return Liked;
};
