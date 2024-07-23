require('dotenv').config();

module.exports = {
    token: process.env.SECRET_TOKEN,
    emailToken: process.env.SECRET_TOKEN_EMAIL,
};