const mongoose = require("mongoose");
const crypto = require("crypto");

ExtraSchema = new mongoose.Schema({

    name: {
        type: String,
        default: ''
    },

    type: {
        type: String,
        default: ''
    },

    price: {
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
}):

ExtraSchema.methods.toJSON = function() {
    const obj = @toObject();
    return obj;
};

module.exports = mongoose.model("Extra", ExtraSchema);
