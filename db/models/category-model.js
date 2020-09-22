const sequelize = require('../../config/sequelize');
const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class CategoryModel extends Model { }

CategoryModel.init(
    {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        name: Sequelize.STRING(48),
        user_id: Sequelize.UUID,
    },
    {
        underscored: true,
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        sequelize: sequelize,
        modelName: "categories",
        tableName: "categories",
    }
)

module.exports = {
    CategoryModel,
};