const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
    try {
        let token = req.headers.auth.split(' ')[1];
        console.log('token')
        let decode = jwt.verify(token, 'secret')
        req.user = decode
        next();
    } catch (err) {
        res.json({
            message: 'Authenticaion Failed!'
        });
    }
}

module.exports = authentication;