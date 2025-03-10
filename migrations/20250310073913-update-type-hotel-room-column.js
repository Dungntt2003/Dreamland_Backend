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
    await queryInterface.changeColumn("Hotel", "description", {
      type: Sequelize.TEXT("long"),
    });

    await queryInterface.changeColumn("Room", "description", {
      type: Sequelize.TEXT("long"),
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("Hotel", "description", {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn("Room", "description", {
      type: Sequelize.STRING,
    });
  },
};
