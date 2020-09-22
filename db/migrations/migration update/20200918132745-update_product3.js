'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'products',
        'weight',
        {
          type: Sequelize.FLOAT
        }
      ),
      queryInterface.addColumn(
        'products',
        'no_isbn',
        {
          type: Sequelize.STRING(255)
        }
      ),
      queryInterface.addColumn(
        'products',
        'image_url',
        {
          type: Sequelize.STRING(255)
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('products', 'weight'),
      queryInterface.removeColumn('products', 'no_isbn'),
      queryInterface.removeColumn('products', 'image_url')
    ]);

  }
};
