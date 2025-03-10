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
    await queryInterface.addColumn("Restaurant", "video", {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn("Restaurant", "description", {
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
    await queryInterface.removeColumn("Restaurant", "video");
    await queryInterface.changeColumn("Restaurant", "description", {
      type: Sequelize.TEXT,
    });
  },
};
