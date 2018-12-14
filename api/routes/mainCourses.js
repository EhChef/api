const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ObjectId = require("mongoose").Types.ObjectId

const utils = require('../../config/utils');

const MainCourse = require('../models/MainCourse');
const checkAuth = require('../middleware/auth');

router.get('/', (req, res, next) => {
    if (utils.requestIsEmpty(req.headers.account)) {
        res.status(500).json({ message: 'You must provide an account id in your request headers.' });
    }

    const limit = parseInt(req.query.count) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || false;
    const mainCourses = await MainCourse
        .find({ account: req.headers.account })
        .skip(offset)
        .limit(limit)
        .sort({ created_at: 1 }).then(mainCourses => {
            res.status(200).json({
                message: 'MainCourses fetched successfully',
                mainCourses: mainCourses
            });
        }).catch(err => {
            res.status(500).json({ message: err.message });
        });
});

router.post('/', checkAuth, (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, async function(err, data) {
        if (err) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'The ressource you are looking for is forbidden.'
            });
        } else {
            if (utils.requestIsEmpty(req.body)) {
                res.status(400).json({ message: 'Cannot create mainCourse, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const mainCourse = new MainCourse({
                account: req.headers.account,
                name: req.body.name,
                available: req.body.available,
                price: req.body.price,
                askBaking: req.body.askBaking,
                askSauce: req.body.askSauce,
            });

            mainCourse
                .save()
                .then(result => {
                    res.status(200).json({
                        message: 'New mainCourse created with success.',
                        mainCourse: mainCourse
                    });
                }).catch(err => {
                    res.status(500).json({ message: err.message });
                });
        }
    });
});

router.get('/:id', checkAuth, (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, function(err, data) {
        if (err) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'The ressource you are looking for is forbidden.'
            });
        } else {
            if (utils.requestIsEmpty(req.params.id) || !ObjectId.isValid(req.params.id)) {
                res.status(400).json({ message: 'Cannot get mainCourse, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const mainCourse = MainCourse
                .findOne({
                    _id: req.params.id,
                    account: req.headers.account
                })
                .then(mainCourse => {
                    res.status(200).json({
                        message: 'MainCourse fetched successfully',
                        mainCourse: mainCourse
                    });
                }).catch(err => {
                    res.status(500).json({ message: err.message });
                });
        }
    });
});

router.post('/:id', checkAuth, (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, async function(err, data) {
        if (err) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'The ressource you are looking for is forbidden.'
            });
        } else {
            if (utils.requestIsEmpty(req.params.id) || !ObjectId.isValid(req.params.id)) {
                res.status(400).json({ message: 'Cannot update mainCourse, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const mainCourse = await MainCourse.findOne({
                _id: req.params.id,
                account: req.headers.account
            });

            Object.assign(mainCourse, req.body);

            mainCourse
                .save()
                .then(result => {
                    res.status(200).json({
                        message: 'MainCourse updated with success.',
                        mainCourse: mainCourse
                    });
                }).catch(err => {
                    res.status(500).json({ message: err.message });
                });
        }
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, function(err, data) {
        if (err) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'The ressource you are looking for is forbidden.'
            });
        } else {
            if (utils.requestIsEmpty(req.params.id) || !ObjectId.isValid(req.params.id)) {
                res.status(400).json({ message: 'Cannot delete mainCourse, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            MainCourse.deleteOne({
                _id: req.params.id,
                account: req.headers.account
            }).then(result => {
                res.status(200).json({
                    success: true,
                    message: 'MainCourse deleted'
                });
            }).catch(err => {
                res.status(500).json({ message: err.message });
            });
        }
    });
});


module.exports = router;
