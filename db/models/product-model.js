const sequelize = require("../../config/sequelize");
const Sequelize = require("sequelize");

class ProductModel extends Sequelize.Model { }

ProductModel.init(
    {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        name: Sequelize.STRING(255),
        description: Sequelize.TEXT,
        user_id: Sequelize.UUID,
        category_id: Sequelize.UUID,
        price: Sequelize.FLOAT,
        stock: Sequelize.INTEGER,
        author: Sequelize.STRING(50),
        weight: Sequelize.FLOAT,
        no_isbn: Sequelize.STRING(255),
        image_url: Sequelize.STRING(255),

    },
    {
        underscored: true,
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        sequelize: sequelize,
        modelName: "products",
        tableName: "products",
    }
);

module.exports = {
    ProductModel,
};