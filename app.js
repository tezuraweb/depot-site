const express = require('express');
const cors = require('cors');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const config = require('./config/appConfig');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = new express();

nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.set('view engine', 'njk');

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));
app.use('/', routes);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});