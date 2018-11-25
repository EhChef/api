const mongoose = require('mongoose');
const autoIncrement = require("mongodb-autoincrement");

const OrderSchema = mongoose.Schema({

    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    },

    orderId: {
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

autoIncrement.setDefaults({
    collection: 'orders',
    field: 'orderId',
    step: 1
});

module.exports = mongoose.model("Order", OrderSchema);
