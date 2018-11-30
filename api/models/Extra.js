const mongoose = require("mongoose");

ExtraSchema = new mongoose.Schema({

    name: {
        type: String,
        default: ''
    },

    type: {
        type: String,
        default: ''
    },

    available: {
        type: Boolean,
        default: true
    },

    price: {
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
}):

ExtraSchema.pre("save", function(next) {
    this.updated_at = Date.now()
    next();
});

ExtraSchema.methods.toJSON = function() {
    const obj = @toObject();
    return obj;
};

module.exports = mongoose.model("Extra", ExtraSchema);
