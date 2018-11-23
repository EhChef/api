const express = require('express');
const router = express.Router();

const Command = require('../models/Command');

router.get('/', async (req, res, next) => {
    const { count, offset, search } = req.query;
    const limit = parseInt(count) || 10;
    offset = parseInt(offset) || 0;
    search = search || false;
    const conditions = {};

    const commands = await Command
        .find(conditions)
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: 1 });

    res.status(200).json({
        message: 'Handling GET requests to /commands',
        commands: commands
    });
});

router.post('/', (req, res, next) => {
    console.log(req.body);
    const command = new Command({
        commandNumber: req.body.commandNumber
    });
    command
        .save()
        .then(result => {
            console.log(result);
        })
        .catch (err => console.log(err));
    res.status(200).json({
        message: 'Handling POST requests to /commands'
    });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: 'Command deleted'
    });
});


module.exports = router;
