const mongoose = require('mongoose');

const CommandSchema = mongoose.Schema({

    app: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "App"
    },

    commandNumber: {
        type: Number,
        default: 0
    },

    menus: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
        }],
        defaut: []
    },

    supplements: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplement"
        }],
        default: []
    },

    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table"
    },

    served: {
        type: Boolean,
        default: false
    },

    totalPrice: {
        type: Number,
        default: 0
    },

    created_at: {
        type: Date,
        default: Date.now
    }

}, {
    shardKey: {
        _id: "hashed"
    }
});

module.exports = mongoose.model("Command", CommandSchema);
