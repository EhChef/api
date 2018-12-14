const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Account = require('../models/Account');

router.get('/', async (req, res, next) => {
    const limit = parseInt(req.query.count) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || false;
    const conditions = {};

    const accounts = await Account
        .find(conditions)
        .skip(offset)
        .limit(limit)
        .sort({ created_at: -1 }).then(accounts => {
            res.status(200).json({
                message: 'Accounts fetched successfully',
                accounts: accounts
            });
        }).catch(err => {
            res.status(500).json({ message: err.message });
        });
});

router.get('/infos', async (req, res, next) => {
    try {
        const account = await Account.findById(req.headers.account);
        res.status(200).json({
            message: 'Accounts fetched successfully',
            account: account,
        });
    }
    catch(err) {
        res.status(500).json({ message: err.message });
    };
});

router.post('/', async (req, res) => {
    const existingAccount = await Account.findOne({ email: req.body.email });
    if (existingAccount) {
        res.status(400).json({
            error: 'BadRequest',
            message: 'An account already exists with this email.'
        });
    }
    const account = new Account({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        city: req.body.city,
        role: req.body.role
    });
    account
        .save()
        .then(result => {
            res.status(200).json({ success: true, account: result });
        }).catch(err => {
            res.status(500).json({ message: err.message });
        });
});

router.post('/login', async (req, res) => {
    const account = await Account.findOne({ email: req.body.email });
    if (!account) {
        res.status(400).json({
            error: 'BadRequest',
            message: 'No account found for provided email.'
        });
    } else {
        if (account.password !== crypto.createHmac("sha256", account.salt).update(req.body.password).digest("hex")) {
            res.status(400).json({
                error: 'BadRequest',
                message: 'Provided password is not valid.'
            });
        }
        const token = jwt.sign({
            email: account.email,
            userId: account._id
        }, process.env.JWT_KEY, { expiresIn: '400h' });
        res.status(200).json({ success: true, account: account, token: token });
    }


})


module.exports = router;
