require('dotenv').config();
const { ProductModel, CategoryModel } = require('../db/models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize')


exports.create = async (req, res, next) => {
    try {

        const { name, description, price, author, weight,
            no_isbn, image_url, category_id } = req.body;

        const imageURL = req.file.filename;

        //CREATE PRODUCT
        const product = await ProductModel.create({
            name,
            description,
            price,
            author,
            weight,
            no_isbn,
            image_url: imageURL,
            category_id,
        });

        return res.status(200).json({
            message: "Success create product",
            data: product,
        });
    } catch (error) {
        console.log(error)
        return next(error)
    }
};

exports.getById = async (req, res, next) => {
    try {
        const data = await ProductModel.findByPk(req.params.id, {
            include: [
                {
                    model: CategoryModel,
                    as: 'category'
                }
            ]
        });
        if (!data) {
            const error = new Error("ID nout found");
            error.statusCode = 400;
            throw error
        };

        return res.status(200).json({
            message: 'Success',
            data: data
        });
    } catch (error) {
        return next(error)
    }
};

exports.updateById = async (req, res, next) => {
    try {
        // UPDATE PRODUCT
        const params = req.body;
        const data = await ProductModel.findByPk(req.params.id);
        if (!data) {
            const error = new Error("ID not found");
            error.statusCode = 400;
            throw error
        };
        data.set(params);
        data.save();
        data.get();

        return res.status(200).json({
            message: 'Success',
            data: data
        });
    } catch (error) {
        return next(error)
    }
};

exports.deleteById = async (req, res, next) => {
    try {
        const params = req.body;
        const data = await ProductModel.findByPk(req.params.id);
        if (!data) {
            const error = new Error("ID nout found");
            error.statusCode = 400;
            throw error
        };
        data.destroy();
        data.save();

        return res.status(200).json({
            message: 'Success',
            data: data
        });
    } catch (error) {
        return next(error)
    }
};

exports.getAllList = async (req, res, next) => {
    try {
        const params = (req.query);
        //Sorting
        const order =
            params.sort_by && params.sort_type ? [[params.sort_by, params.sort_type]] : [["id", "DESC"]];

        //Pagination
        const limit = params.limit ? Number(params.limit) : 10;
        const offset = Number(limit) * ((Number(params.page || 1) || 1) - 1);
        //Searching
        const where = {}
        if (params.name) where.name = { [Op.like]: `%${params.name}%` }
        if (params.author) where.author = { [Op.like]: `%${params.author}%` }

        const data = await ProductModel.findAndCountAll({
            where,
            order,
            attributes: this.attributes,
            limit,
            offset,
        });

        data.limit = limit;
        data.offset = offset;
        data.page = offset / limit + 1;
        return res.status(200).json({
            message: 'Success',
            data: data
        });

    } catch (error) {
        return next(error)
    }
};
