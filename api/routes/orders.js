const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const utils = require('../../config/utils');

const Order = require('../models/Order');
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
            const orders = await Order
                .find({ account: req.headers.account })
                .skip(offset)
                .limit(limit)
                .sort({ createdAt: 1 }).then(orders => {
                    res.status(200).json({
                        message: 'Orders fetched successfully',
                        orders: orders
                    });
                }).catch(err => {
                    res.status(500).json({ message: err.message });
                });
        }
    });
});

router.post('/', async (req, res, next) => {
    if (utils.requestIsEmpty(req.body)) {
        res.status(400).json({ message: 'Cannot create order, empty request.' });
    }
    if (utils.requestIsEmpty(req.headers.account)) {
        res.status(500).json({ message: 'You must provide an account id in your request headers.' });
    }
    let lastOrder = await Order
        .find({ account: req.body.account })
        .limit(1)
        .sort({ createdAt: -1 });

    const order = new Order({
        account: req.headers.account,
        orderId: lastOrder.length > 0 ? lastOrder[0].orderId + 1 : 0,
        menus: req.body.menus,
        starters: req.body.starters,
        mainCourses: req.body.mainCourses,
        desserts: req.body.desserts,
        supplements: req.body.supplements,
        table: req.body.table,
        served: false,
        totalPrice: req.body.totalPrice
    });

    order
        .save()
        .then(result => {
            res.status(200).json({
                message: 'New order created with success.',
                order: order
            });
        }).catch(err => {
            res.status(500).json({ message: err.message });
        });
});

router.delete('/:id', (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, function(err, data) {
        if (err) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'The ressource you are looking for is forbidden.'
            });
        } else {
            if (utils.requestIsEmpty(req.params.id) || !ObjectId.isValid(req.params.id)) {
                res.status(400).json({ message: 'Cannot delete order, empty request.' });
            }
            if (utils.requestIsEmpty(req.headers.account)) {
                res.status(500).json({ message: 'You must provide an account id in your request headers.' });
            }
            const id = req.params.id;
            Order.deleteOne({
                _id: req.params.id
                account: req.headers.account
            }).then(result => {
                res.status(200).json({
                    success: true,
                    message: 'Order deleted'
                });
            }).catch(err => {
                res.status(500).json({ message: err.message });
            });
        }
    });
});


module.exports = router;
