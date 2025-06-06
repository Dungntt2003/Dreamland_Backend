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
    await queryInterface.addColumn("ServicePayment", "countAdult", {
      type: Sequelize.INTEGER,
    });

    await queryInterface.addColumn("ServicePayment", "countChild", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("ServicePayment", "orderDate", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("ServicePayment", "countAdult");
    await queryInterface.removeColumn("ServicePayment", "countChild");
    await queryInterface.removeColumn("ServicePayment", "orderDate");
  },
};
