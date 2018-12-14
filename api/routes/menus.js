const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ObjectId = require("mongoose").Types.ObjectId

const utils = require('../../config/utils');

const Menu = require('../models/Menu');
const checkAuth = require('../middleware/auth');

router.get('/', (req, res, next) => {
    if (utils.requestIsEmpty(req.headers.account)) {
        res.status(500).json({ message: 'You must provide an account id in your request headers.' });
    }

    const limit = parseInt(req.query.count) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || false;
    const menus = Menu
        .find({ account: req.headers.account })
        .skip(offset)
        .limit(limit)
        .sort({ created_at: 1 }).then(menus => {
            res.status(200).json({
                message: 'Menus fetched successfully',
                menus: menus
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
                res.status(400).json({ message: 'Cannot create menu, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const menu = new Menu({
                account: req.headers.account,
                name: req.body.name,
                price: req.body.price,
                starter: req.body.starter,
                mainCourse: req.body.mainCourse,
                dessert: req.body.dessert,
                available: req.body.available,
            });

            menu
                .save()
                .then(result => {
                    res.status(200).json({
                        message: 'New menu created with success.',
                        menu: menu
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
                res.status(400).json({ message: 'Cannot get menu, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const menu = Menu
                .findOne({
                    _id: req.params.id,
                    account: req.headers.account
                })
                .then(menu => {
                    res.status(200).json({
                        message: 'Menu fetched successfully',
                        menu: menu
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
                res.status(400).json({ message: 'Cannot update menu, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const menu = await Menu.findOne({
                _id: req.params.id,
                account: req.headers.account
            });

            Object.assign(menu, req.body);

            menu
                .save()
                .then(result => {
                    res.status(200).json({
                        message: 'Menu updated with success.',
                        menu: menu
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
                res.status(400).json({ message: 'Cannot delete menu, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            Menu.deleteOne({
                _id: req.params.id,
                account: req.headers.account
            }).then(result => {
                res.status(200).json({
                    success: true,
                    message: 'Menu deleted'
                });
            }).catch(err => {
                res.status(500).json({ message: err.message });
            });
        }
    });
});


module.exports = router;
