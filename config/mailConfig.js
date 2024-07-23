require('dotenv').config();

module.exports = {
    address: process.env.MAIL_ADDRESS,
    password: process.env.MAIL_PASSWORD,
    host: process.env.MAIL_HOST,
};