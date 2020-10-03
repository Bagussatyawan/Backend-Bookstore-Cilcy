require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UserModel } = require('../db/models')

const authorize = (levels = []) => {
    try {
        if (typeof levels === "string") {
            levels = [levels]
        }
        return [
            async (req, res, next) => {
                try {
                    const token = req.header("Authorization").replace("Bearer ", "")
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const user = await UserModel.findOne({
                        where: {
                            id: decoded.sub,
                        },
                    });

                    if (levels.length && !levels.includes(user.level)) {
                        return res.status(401).send({
                            message: "Unauthorized",
                        });
                    }
                    req.body.user_id = user.id
                    next()
                } catch (error) {
                    return res.status(401).send({
                        message: "Unauthorized",
                    });
                }
            },
        ];
    } catch (error) {
        console.log(error)
    }
};


module.exports = authorize;