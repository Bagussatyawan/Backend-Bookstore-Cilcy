const models = require('../db/models');
const { OrderModel, TransactionModel, ProductModel } = require('../db/models');

exports.order = async (req, res, next) => {
    try {
        const { transaction_id, product_id, total, user_id } = req.body;

        const product = await ProductModel.findOne({
            where: {
                id: product_id
            }
        });
        if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error
        };

        const transaction = await TransactionModel.findOne({
            where: {
                id: transaction_id
            }
        });
        if (!transaction) {
            const error = new Error("Transaction id not found");
            error.statusCode = 404;
            throw error
        };

        const order = await OrderModel.create({
            transaction_id,
            product_id,
            price: product.price,
            total,
            name: product.name,
            description: product.description,
            user_id
        });
        return res.status(200).json({
            message: "Success order product",
            data: order
        })
    } catch (error) {
        return next(error)
    }
};

exports.update = async (req, res, next) => {
    try {
        const params = req.body;
        const data = await OrderModel.findByPk(req.params.id);
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
        console.log(error)
        return next(error)
    }
};

exports.getById = async (req, res, next) => {
    try {
        const data = await OrderModel.find(req.params.id);
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

exports.getAllList = async (req, res, next) => {
    try {
        const params = (req.query);
        const data = await OrderModel.findAndCountAll(params, {

            include: {
                model: TransactionModel,

            }
        });
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
        const data = await OrderModel.findByPk(req.params.id);
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