const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .get(auth, (req, res) => {
        res.render('nodes/index', { activePage: 'main' });
    });

router
    .route('/search')
    .get(auth, (req, res) => {
        res.render('nodes/search');
    });

router
    .route('/premises/:id')
    .get(auth, (req, res) => {
        res.render('nodes/premises');
    });

router
    .route('/about')
    .get(auth, (req, res) => {
        res.render('nodes/company');
    });

router
    .route('/lightindustrial')
    .get(auth, (req, res) => {
        res.render('nodes/lightindustrial');
    });

module.exports = router;