const mongoose = require('mongoose');

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

    starters: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Starter"
        }],
        default: []
    },

    mainCourses: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "MainCourse"
        }],
        default: []
    },

    desserts: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dessert"
        }],
        default: []
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
    },

    updated_at: {
        type: Date,
    }

}, {
    shardKey: {
        _id: "hashed"
    }
});

OrderSchema.pre("save", function(next) {
    this.updated_at = Date.now()
    next();
});

OrderSchema.methods.toJSON = function() {
    const obj = this.toObject();
    return obj;
};

module.exports = mongoose.model("Order", OrderSchema);
