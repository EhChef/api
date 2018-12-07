const jwt = require('jsonwebtoken');

module.exports = {
    requestIsEmpty(body) {
        return !body || Object.keys(body).length === 0;
    }
}
