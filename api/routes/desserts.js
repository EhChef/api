const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ObjectId = require("mongoose").Types.ObjectId

const utils = require('../../config/utils');

const Dessert = require('../models/Dessert');
const checkAuth = require('../middleware/auth');

router.get('/', (req, res, next) => {
    if (utils.requestIsEmpty(req.headers.account)) {
        res.status(500).json({ message: 'You must provide an account id in your request headers.' });
    }

    const limit = parseInt(req.query.count) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || false;
    const desserts = Dessert
        .find({ account: req.headers.account })
        .skip(offset)
        .limit(limit)
        .sort({ created_at: 1 }).then(desserts => {
            res.status(200).json({
                message: 'Desserts fetched successfully',
                desserts: desserts
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
                res.status(400).json({ message: 'Cannot create dessert, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const dessert = new Dessert({
                account: req.headers.account,
                name: req.body.name,
                available: req.body.available,
                price: req.body.price,
            });

            dessert
                .save()
                .then(result => {
                    res.status(200).json({
                        message: 'New dessert created with success.',
                        dessert: dessert
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
                res.status(400).json({ message: 'Cannot get dessert, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const dessert = Dessert
                .findOne({
                    _id: req.params.id,
                    account: req.headers.account
                })
                .then(dessert => {
                    res.status(200).json({
                        message: 'Dessert fetched successfully',
                        dessert: dessert
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
                res.status(400).json({ message: 'Cannot update dessert, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const dessert = await Dessert.findOne({
                _id: req.params.id,
                account: req.headers.account
            });

            Object.assign(dessert, req.body);

            dessert
                .save()
                .then(result => {
                    res.status(200).json({
                        message: 'Dessert updated with success.',
                        dessert: dessert
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
                res.status(400).json({ message: 'Cannot delete dessert, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            Dessert.deleteOne({
                _id: req.params.id,
                account: req.headers.account
            }).then(result => {
                res.status(200).json({
                    success: true,
                    message: 'Dessert deleted'
                });
            }).catch(err => {
                res.status(500).json({ message: err.message });
            });
        }
    });
});


module.exports = router;
