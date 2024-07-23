require('dotenv').config();
const fs = require('fs');
const path = require('path');

module.exports = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ca: fs.readFileSync(path.join(__dirname, process.env.CACERT)),
};
