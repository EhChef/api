const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ObjectId = require("mongoose").Types.ObjectId

const utils = require('../../config/utils');

const Extra = require('../models/Extra');
const checkAuth = require('../middleware/auth');

router.get('/', (req, res, next) => {
    if (utils.requestIsEmpty(req.headers.account)) {
        res.status(500).json({ message: 'You must provide an account id in your request headers.' });
    }

    const limit = parseInt(req.query.count) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || false;
    const extras = await Extra
        .find({ account: req.headers.account })
        .skip(offset)
        .limit(limit)
        .sort({ created_at: 1 }).then(extras => {
            res.status(200).json({
                message: 'Extras fetched successfully',
                extras: extras
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
                res.status(400).json({ message: 'Cannot create extra, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const extra = new Extra({
                account: req.headers.account,
                name: req.body.name,
                type: req.body.type,
                available: req.body.available,
                price: req.body.price,
            });

            extra
                .save()
                .then(result => {
                    res.status(200).json({
                        message: 'New extra created with success.',
                        extra: extra
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
                res.status(400).json({ message: 'Cannot get extra, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const extra = Extra
                .findOne({
                    _id: req.params.id,
                    account: req.headers.account
                })
                .then(extra => {
                    res.status(200).json({
                        message: 'Extra fetched successfully',
                        extra: extra
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
                res.status(400).json({ message: 'Cannot update extra, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const extra = await Extra.findOne({
                _id: req.params.id,
                account: req.headers.account
            });

            Object.assign(extra, req.body);

            extra
                .save()
                .then(result => {
                    res.status(200).json({
                        message: 'Extra updated with success.',
                        extra: extra
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
                res.status(400).json({ message: 'Cannot delete extra, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            Extra.deleteOne({
                _id: req.params.id,
                account: req.headers.account
            }).then(result => {
                res.status(200).json({
                    success: true,
                    message: 'Extra deleted'
                });
            }).catch(err => {
                res.status(500).json({ message: err.message });
            });
        }
    });
});


module.exports = router;
