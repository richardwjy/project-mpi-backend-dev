const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const bearerHeader = req.header('Authorization');
    let parts = bearerHeader.split(' ');
    if (parts.length == 2) {
        let scheme = parts[0];
        let credentials = parts[1];
        try {
            const verified = jwt.verify(credentials, process.env.TOKEN_SECRET)
            req.user = verified
            next()
        } catch (err) {
            return res.status(400).json({ message: 'Invalid Token' })
        }
    }
}