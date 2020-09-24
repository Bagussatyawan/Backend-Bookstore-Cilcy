require('dotenv').config();
const jwt = require("jsonwebtoken");
const { TransactionModel, UserModel } = require("../db/models");

exports.create = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            const error = new Error("Authorization required");
            error.statusCode = 401;
            throw error;
        };

        const token = authorization.split(" ")[1]
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decodedToken.sub;

        const user = await UserModel.findOne({
            where: {
                id: user_id,
            },
        });
        if (!user) {
            const error = new Error("User with this token not found");
            error.statusCode = 401;
            throw error;
        };

        const transaction = await TransactionModel.create({
            amount: 0,
            status: "PENDING",
            user_id: user.id,
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
        const { authorization } = req.headers;
        if (!authorization) {
            const error = new Error("Authorization required");
            error.statusCode = 401;
            throw error;
        };

        const token = authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decodedToken.sub;

        const user = await UserModel.findOne({
            where: {
                id: user_id
            }
        });

        if (!user) {
            const error = new Error("User with this token not found");
            error.statusCode = 401;
            throw error;
        };

    } catch (error) {
        return next(error)
    }
};
