const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    console.log('bearer : ', bearerHeader);

    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        req.token = token;
        next();
    } else {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Unauthorized access, auth failed.'
        });
    }
}
