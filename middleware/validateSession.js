const jwt = require('jsonwebtoken');
const { models } = require('../db');


const validateJWT = async (req, res, next) => {
    try {
        if (req.method == 'OPTIONS') {
            next();
        } else if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
            const { authorization } = req.headers;
            const payload = authorization ? jwt.verify(
                authorization.includes('Bearer') ? authorization.split(' ')[1] : authorization,
                process.env.JWT_SECRET
            ) : undefined;
                    
            if (payload) {

                let foundUser = await models.UserModel.findOne({
                    where: {
                        id: payload.id
                    }
                });
    
                if (foundUser) {
                    req.user = foundUser;
                    next();
                } else {
                    res.status(400).send({
                        message: 'Not Authorized'
                    });
                }
            } 
        } else {
            res.status(403).send({
                message: 'Forbidden'
            });
        };
    } catch (error) {
        console.log(error)
        res.status(401).json({ msg: "Invalid token", err: `${error}`})

    }
};

module.exports = validateJWT;