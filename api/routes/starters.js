const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const utils = require('../../config/utils');

const Starter = require('../models/Starter');
const checkAuth = require('../middleware/auth');

router.get('/', checkAuth, (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, async function(err, data) {
        if (err) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'The ressource you are looking for is forbidden.'
            });
        } else {
            const limit = parseInt(req.query.count) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const search = req.query.search || false;
            const conditions = {};
            const starters = await Starter
                .find(conditions)
                .skip(offset)
                .limit(limit)
                .sort({ createdAt: 1 }).then(starters => {
                    res.status(200).json({
                        message: 'Starters fetched successfully',
                        starters: starters
                    });
                }).catch(err => {
                    res.status(500).json({ message: err.message });
                });
        }
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
                res.status(400).json({ message: 'Cannot create starter, empty request.' });
            }

            const starter = new Starter({
                account: req.body.account,
                name: req.body.name,
                available: true,
                price: req.body.price,
            });

            starter
                .save()
                .then(result => {
                    res.status(200).json({
                        message: 'New starter created with success.',
                        starter: starter
                    });
                }).catch(err => {
                    res.status(500).json({ message: err.message });
                });
        }
    })
});

router.delete('/:id', (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, function(err, data) {
        if (err) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'The ressource you are looking for is forbidden.'
            });
        } else {
            if (utils.requestIsEmpty(req.params.id)) {
                res.status(400).json({ message: 'Cannot delete starter, empty request.' });
            }
            const id = req.params.id;
            Starter.deleteOne({
                _id: req.params.id
            }).then(result => {
                res.status(200).json({
                    success: true,
                    message: 'Starter deleted'
                });
            }).catch(err => {
                res.status(500).json({ message: err.message });
            });
        }
    });
});


module.exports = router;
