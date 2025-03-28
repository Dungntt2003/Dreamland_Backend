"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Schedule", {
      id: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.STRING,
      },
      service_id: {
        type: Sequelize.STRING,
      },
      service_type: {
        type: Sequelize.ENUM("sight", "hotel", "restaurant", "entertainment"),
      },
      repository_id: {
        type: Sequelize.STRING,
        references: {
          model: "Repository",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      start: {
        type: Sequelize.DATE,
      },
      end: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Schedule");
  },
};
