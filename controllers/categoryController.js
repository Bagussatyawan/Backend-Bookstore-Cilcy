require('dotenv').config();
const jwt = require('jsonwebtoken');
const { CategoryModel } = require('../db/models');
const { Op } = require('sequelize')


exports.create = async (req, res, next) => {
    try {
        const { name } = req.body;

        const categories = await CategoryModel.create({
            name,
        });

        return res.status(200).json({
            message: "Success",
            data: categories
        });
    } catch (error) {
        return next(error)
    }
};

exports.getById = async (req, res, next) => {
    try {
        const data = await CategoryModel.findByPk(req.params.id);
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
        const params = req.body;
        const data = await CategoryModel.findByPk(req.params.id);
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
        const data = await CategoryModel.findByPk(req.params.id);
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
        const where = {}
        if (params.name) where.name = { [Op.like]: `%${params.name}%` }
        if (params.author) where.author = { [Op.like]: `%${params.author}%` }
        const data = await CategoryModel.findAndCountAll({
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

