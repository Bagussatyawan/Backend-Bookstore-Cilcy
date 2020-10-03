const { TransactionModel, OrderModel } = require("../db/models");
const db = require('../config/sequelize');

exports.create = async (req, res, next) => {
    try {

        const transaction = await TransactionModel.create({
            amount: 0,
            status: "PENDING",
        });

        return res.status(200).json({
            message: "Success create transaction",
            data: transaction,
        });
    } catch (error) {
        return next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { status, transaction_id } = req.body;
        const existTransaction = await TransactionModel.findOne({
            where: {
                id: transaction_id
            },
            include: {
                model: OrderModel,
                as: 'orders'
            }
        });
        if (!existTransaction) {
            const error = new Error("Transaction not found");
            error.statusCode = 404;
            throw error
        };

        let amount = 0;
        existTransaction.orders.map((order) => {
            amount += order.price * order.total;
        });

        await TransactionModel.update({
            amount,
            status: status ? status : existTransaction.status,
        },
            {
                where: { id: transaction_id }
            }
        );

        return res.status(200).json({
            message: "Succes update transaction"
        });

    } catch (error) {
        return next(error)
    }
};

exports.getById = async (req, res, next) => {
    try {
        const data = await TransactionModel.findByPk(req.params.id);
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
        console.log(error)
        return next(error)
    }
};

exports.getAllList = async (req, res, next) => {
    try {
        const params = (req.query);
        const data = await TransactionModel.findAll(params, {
            where: {
                user_id: req.params.id,
                status: "PENDING"
            },
            include: {
                model: OrderModel,

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

exports.addtocart = async (req, res, next) => {
    const transaction = await db.transaction()
    try {
        const TransactionProduct = await TransactionModel.create(
            {
                amount: 0,
                status: "PENDING",
                user_id: req.body.user_id
            },
            { transaction }
        )
        await OrderModel.create({ ...req.body, product_id: req.body.id, transaction_id: TransactionProduct.id }, { transaction })

        await transaction.commit()
        res.status(201).send({
            message: 'Data Saved',
        })
    } catch (e) {
        await transaction.rollback()
        res.status(400).send({
            message: e,
        })
    }
}