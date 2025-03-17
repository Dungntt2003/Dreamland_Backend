"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Sight", "rate", {
      type: Sequelize.INTEGER,
      defaultValue: () => Math.floor(Math.random() * 5) + 1,
    });
    await queryInterface.addColumn("Entertainment", "rate", {
      type: Sequelize.INTEGER,
      defaultValue: () => Math.floor(Math.random() * 5) + 1,
    });
    await queryInterface.addColumn("Hotel", "rate", {
      type: Sequelize.INTEGER,
      defaultValue: () => Math.floor(Math.random() * 5) + 1,
    });
    await queryInterface.addColumn("Restaurant", "rate", {
      type: Sequelize.INTEGER,
      defaultValue: () => Math.floor(Math.random() * 5) + 1,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Sight", "rate");
    await queryInterface.removeColumn("Entertainment", "rate");
    await queryInterface.removeColumn("Hotel", "rate");
    await queryInterface.removeColumn("Restaurant", "rate");
  },
};
