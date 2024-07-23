const jwt = require("jsonwebtoken");
const config = require('../config/jwtConfig');

const verifyToken = (req, res, next) => {
    const token = req.cookies['secretToken'];
    const originalUrl = req.originalUrl;

    if (!token) {
        if (originalUrl.startsWith('/api')) {
            return res.status(401).json({ message: 'Authentication error' });
        } else if (originalUrl.startsWith('/backoffice')) {
            return res.redirect('/auth/login');
        }
        return next();
    }

    try {
        const decoded = jwt.verify(token, config.token);
        req.user = decoded;
        if (originalUrl.startsWith('/auth')) {
            if (decoded.status == 'admin') {
                return res.redirect('/backoffice/editor');
            } else {
                return res.redirect('/backoffice/profile');
            }
        }
        return next();
    } catch (err) {
        console.log(err.message);
        if (originalUrl.startsWith('/api')) {
            return res.status(401).json({ message: 'Authentication error' });
        } else if (originalUrl.startsWith('/backoffice')) {
            return res.redirect('/auth/login');
        }
        return next();
    }
};

module.exports = verifyToken;
