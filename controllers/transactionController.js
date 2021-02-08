require('dotenv').config();
const { TransactionModel, OrderModel } = require("../db/models");
const db = require('../config/sequelize');
// const axios = require('axios');



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

        await TransactionModel.update({
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

exports.checkout = async (req, res, next) => {
    const transaction = await db.transaction()
    try {
        const carts = req.body.carts
        console.log(req.body)
        const temp_cart = []
        let amount = 0;
        carts.map((order) => {
            amount += order.price * order.qty;
        })

        const TransactionProduct = await TransactionModel.create(
            {
                amount: amount,
                status: "PENDING",
                user_id: req.body.user_id
            },
            { transaction }
        )

        carts.map((order) => {
            temp_cart.push({
                transaction_id: TransactionProduct.id,
                user_id: req.body.user_id,
                product_id: order.id,
                price: order.price,
                total: order.qty,
                name: order.name
            })
        });

        await OrderModel.bulkCreate(temp_cart, { transaction })

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

exports.getAllOrder = async (req, res, next) => {
    try {
        const data = await TransactionModel.findAll({
            where: {
                user_id: req.params.user_id
            }
        });


        return res.status(200).json({
            message: 'Success',
            data: data
        });

    } catch (error) {
        return next(error)
    }
}

 // MIDTRANS PAYMENT
        // await function createMidtransTransaction(order_id, amount) {
        //     const { MIDTRANS_URL, MIDTRANS_USER } = process.env;
        //     return axios.post(
        //         MIDTRANS_URL,
        //         {
        //             transaction_details: {
        //                 order_id,
        //                 gross_amount: amount
        //             }
        //         },
        //         {
        //             auth: {
        //                 username: MIDTRANS_USER,
        //                 password: ''
        //             },
        //             headers: {
        //                 Accept: 'application/json',
        //                 'Content-Type': 'application/json'
        //             }
        //         }
        //     );
        // }

         // await createMidtransTransaction(
        //     {
        //         order_id,
        //         gross_amount: amount
        //     },
        // )
