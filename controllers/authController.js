require('dotenv').config();
const bcrypt = require('bcrypt');
const { UserModel } = require('../db/models');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, level, password } = req.body;
        const existUser = await UserModel.findOne(
            {
                where: {
                    email,
                }
            });
        if (existUser) {
            const error = new Error("User with this email already exist");
            error.statusCode = 400;
            throw error;
        };
        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 12);
        //CREATE USER
        const user = await UserModel.create({
            first_name,
            last_name,
            email,
            level,
            password: hashedPassword,
        });

        return res.status(200).json({
            message: 'Succes register new user',
            data: user,
        })

    } catch (error) {
        return next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        //INPUT EMAIL AND PASSWORD
        const { email, password, level } = req.body;
        //FIND EMAIL
        const existUser = await UserModel.findOne(
            {
                where: {
                    email
                }
            });
        // IF EMAIL NOT EXIST
        if (!existUser) {
            const error = new Error('User with this email not found');
            error.statusCode = 404;
            throw error;
        };
        //IF EMAIL EXIST THEN CHECK PASSWORD
        const isSamePassword = await bcrypt.compare(password, existUser.password);
        if (!isSamePassword) {
            const error = new Error('Password wrong!');
            error.statusCode = 401; // 401 is unAuthorized status
            throw error;
        };

        const payload = {
            sub: existUser.id,
            level: existUser.level
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: '1d',
        });
        // IS ALL ALREADY CORRECT
        return res.status(200).json({
            message: "Succes login user",
            data: {
                access_token: token,
                type: "Bearer",
                email: existUser.email,
                user_id: existUser.id,
                level: existUser.level
            },
        })
    } catch (error) {
        return next(error)
    }
};

