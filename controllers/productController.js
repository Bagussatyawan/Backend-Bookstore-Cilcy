require('dotenv').config();
const { UserModel, ProductModel, CategoryModel } = require('../db/models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize')


exports.create = async (req, res, next) => {
    try {
        // TO GET TOKEN PASSWORD FROM USER
        const { authorization } = req.headers;
        const { name, description,
            price,
            author, weight,
            no_isbn, image_url, category_id } = req.body;

        if (!authorization) {
            const error = new Error("Authorization required");
            error.statusCode = 401;
            throw error;
        };

        // SPLIT TYPE OF BEARER WITH TOKEN
        const token = authorization.split(" ")[1]
        const _token = token.split('"')[1]
        console.log("_TOKEN", _token)
        //ENCRYPTION TOKEN PASSWORD
        const decodedToken = jwt.verify(_token, process.env.JWT_SECRET);
        const user_id = decodedToken.sub;
        //CHECK IS USER EXIST
        const user = await UserModel.findOne({
            where: {
                id: user_id,
                level: "admin"
            }
        });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 401; // 401 is unAuthorized status
            throw error;
        };
        console.log('REQQ', req)
        console.log('REQFIILE', req.file)
        //UPLOAD RESPONSE
        const imageURL = req.file.path + (req.file.mimetype === 'image/png' ? '.png' : '.jpg');

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
            user_id: user.id
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
        // AUTHORIZATION USER
        const { authorization } = req.headers;
        const params = req.body;

        if (!authorization) {
            const error = new Error('Authorization required')
            error.statusCode = 401;
            throw error
        };

        const token = authorization.split(" ")[1]
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decodedToken.sub;
        const user = await UserModel.findOne({
            where: {
                id: user_id,
                level: "admin"
            }
        });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 401;
            throw error
        };

        // UPDATE PRODUCT
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
        const { authorization } = req.headers;
        const params = req.body;

        if (!authorization) {
            const error = new Error("Authorization required");
            error.statusCode = 401;
            throw error;
        };

        const token = authorization.split(" ")[1]
        const _token = token.split('"')[1]
        console.log("_TOKEN", _token)
        //ENCRYPTION TOKEN PASSWORD
        const decodedToken = jwt.verify(_token, process.env.JWT_SECRET);
        const user_id = decodedToken.sub;
        //CHECK IS USER EXIST
        const user = await UserModel.findOne({
            where: {
                id: user_id,
                level: "admin"
            }
        });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 401; // 401 is unAuthorized status
            throw error;
        };

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
