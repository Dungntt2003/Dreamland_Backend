"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ServicePayment", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: false,
      },
      repository_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Repository",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      service_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      service_type: {
        type: Sequelize.ENUM("hotel", "restaurant", "entertainment"),
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      note: {
        type: Sequelize.STRING,
      },
      result: {
        type: Sequelize.ENUM("fail", "success", "pending"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ServicePayment");
  },
};
