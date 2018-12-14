const mongoose = require("mongoose");

TableSchema = new mongoose.Schema({

    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },

    tableNumber: {
        type: Number
    },

    capacity: {
        type: Number,
        default: ''
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

TableSchema.pre("save", function(next) {
    this.updated_at = Date.now()
    next();
});

TableSchema.methods.toJSON = function() {
    const obj = this.toObject();
    return obj;
};

module.exports = mongoose.model("Table", TableSchema);
