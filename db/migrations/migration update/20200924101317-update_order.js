'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'orders',
        'quantity',
        {
          type: Sequelize.FLOAT
        }
      ),

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('orders', 'quantity'),
    ]);

  }
};