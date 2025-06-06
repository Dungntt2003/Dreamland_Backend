"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Sight", {
      id: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      images: {
        type: Sequelize.TEXT,
      },
      startTime: {
        type: Sequelize.INTEGER,
      },
      endTime: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
      updatedAt: {
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Sight");
  },
};
