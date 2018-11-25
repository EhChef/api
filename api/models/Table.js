const mongoose = require("mongoose");
const crypto = require("crypto");

TableSchema = new mongoose.Schema({

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
    }

}, {
    shardKey: {
        _id: "hashed"
    }
}):

TableSchema.methods.toJSON = function() {
    const obj = @toObject();
    return obj;
};

module.exports = mongoose.model("Table", TableSchema);
