const express = require('express');
const router = express.Router();

const Account = require('../models/Account');

router.post('/', (req, res) => {
    const account = new Account({
        name: req.body.name,
        pseudo: req.body.pseudo,
        password: req.body.password,
        address: req.body.address,
        city: req.body.city,
        role: req.body.role
    });
    account
        .save()
        .then(result => {
            console.log(result);
        })
        .catch (err => console.log(err));
    res.status(200).json({
        message: 'Handling POST requests to /accounts',
        account: account
    });
});


module.exports = router;
