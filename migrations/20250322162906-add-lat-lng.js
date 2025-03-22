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
    await queryInterface.addColumn("Sight", "lat", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("Sight", "lng", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("Entertainment", "lat", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("Entertainment", "lng", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("Hotel", "lat", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("Hotel", "lng", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("Restaurant", "lat", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("Restaurant", "lng", {
      type: Sequelize.FLOAT,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Sight", "lat");
    await queryInterface.removeColumn("Sight", "lng");
    await queryInterface.removeColumn("Entertainment", "lat");
    await queryInterface.removeColumn("Entertainment", "lng");
    await queryInterface.removeColumn("Hotel", "lat");
    await queryInterface.removeColumn("Hotel", "lng");
    await queryInterface.removeColumn("Restaurant", "lat");
    await queryInterface.removeColumn("Restaurant", "lng");
  },
};
