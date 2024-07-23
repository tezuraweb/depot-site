const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

router
    .route('/profile')
    .get(auth, (req, res) => {
        if (req.user.status && req.user.status === 'admin') {
            return res.redirect('/backoffice/editor');
        }
        res.render('nodes/profile', { user: req.user, page: 'profile' });
    });

router
    .route('/documents')
    .get(auth, (req, res) => {
        if (req.user.status && req.user.status === 'admin') {
            return res.redirect('/backoffice/editor');
        }
        res.render('nodes/docs', { user: req.user, page: 'docs' });
    });

router
    .route('/requests')
    .get(auth, (req, res) => {
        if (req.user.status && req.user.status === 'admin') {
            return res.redirect('/backoffice/editor');
        }
        res.render('nodes/requests', { user: req.user, page: 'requests' });
    });

router
    .route('/promotions')
    .get(auth, (req, res) => {
        if (req.user.status && req.user.status === 'tenant') {
            return res.redirect('/backoffice/profile');
        }
        res.render('nodes/promotions', { user: req.user, page: 'promotions' });
    });

router
    .route('/editor')
    .get(auth, (req, res) => {
        if (req.user.status && req.user.status === 'tenant') {
            return res.redirect('/backoffice/profile');
        }
        res.render('nodes/editor', { user: req.user, page: 'editor' });
    });

// router
//     .route('/feedback')
//     .get(auth, (req, res) => {
//         if (req.user.status && req.user.status === 'tenant') {
//             return res.redirect('/backoffice/profile');
//         }
//         res.render('nodes/feedback', { user: req.user, page: 'feedback' });
//     });

router
    .route('/report')
    .get(auth, (req, res) => {
        if (req.user.status && req.user.status === 'tenant') {
            return res.redirect('/backoffice/profile');
        }
        res.render('nodes/report', { user: req.user, page: 'report' });
    });

module.exports = router;