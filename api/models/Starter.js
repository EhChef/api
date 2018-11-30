const mongoose = require("mongoose");

StarterSchema = new mongoose.Schema({

    name: {
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
        default: Date.now
    }

}, {
    shardKey: {
        _id: "hashed"
    }
}):

StarterSchema.pre("save", function(next) {
    this.updated_at = Date.now()
    next();
});

StarterSchema.methods.toJSON = function() {
    const obj = this.toObject();
    return obj;
};

module.exports = mongoose.model("Starter", StarterSchema);
