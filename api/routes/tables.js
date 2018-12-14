const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ObjectId = require("mongoose").Types.ObjectId

const utils = require('../../config/utils');

const Table = require('../models/Table');
const checkAuth = require('../middleware/auth');

router.get('/', checkAuth, (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, async function(err, data) {
        if (err) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'The ressource you are looking for is forbidden.'
            });
        } else {
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }

            const limit = parseInt(req.query.count) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const search = req.query.search || false;
            const tables = await Table
                .find({ account: req.headers.account })
                .skip(offset)
                .limit(limit)
                .sort({ created_at: 1 }).then(tables => {
                    res.status(200).json({
                        message: 'Tables fetched successfully',
                        tables: tables
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
                res.status(400).json({ message: 'Cannot create table, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const table = new Table({
                account: req.headers.account,
                tableNumber: req.body.tableNumber,
                capacity: req.body.capacity
            });

            table
                .save()
                .then(result => {
                    res.status(200).json({
                        message: 'New table created with success.',
                        table: table
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
                res.status(400).json({ message: 'Cannot get table, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const table = Table
                .findOne({
                    _id: req.params.id,
                    account: req.headers.account
                })
                .then(table => {
                    res.status(200).json({
                        message: 'Table fetched successfully',
                        table: table
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
                res.status(400).json({ message: 'Cannot update table, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const table = await Table.findOne({
                _id: req.params.id,
                account: req.headers.account
            });

            Object.assign(table, req.body);

            table
                .save()
                .then(result => {
                    res.status(200).json({
                        message: 'Table updated with success.',
                        table: table
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
                res.status(400).json({ message: 'Cannot delete table, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            Table.deleteOne({
                _id: req.params.id,
                account: req.headers.account
            }).then(result => {
                res.status(200).json({
                    success: true,
                    message: 'Table deleted'
                });
            }).catch(err => {
                res.status(500).json({ message: err.message });
            });
        }
    });
});


module.exports = router;
