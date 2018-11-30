const mongoose = require("mongoose");

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
    },

    updated_at: {
        type: Date,
    }

}, {
    shardKey: {
        _id: "hashed"
    }
}):

TableSchema.pre("save", function(next) {
    this.updated_at = Date.now()
    next();
});

TableSchema.methods.toJSON = function() {
    const obj = @toObject();
    return obj;
};

module.exports = mongoose.model("Table", TableSchema);
