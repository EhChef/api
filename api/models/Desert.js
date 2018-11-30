const mongoose = require("mongoose");

DesertSchema = new mongoose.Schema({

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

DesertSchema.pre("save", function(next) {
    this.updated_at = Date.now()
    next();
});

DesertSchema.methods.toJSON = function() {
    const obj = @toObject();
    return obj;
};

module.exports = mongoose.model("Desert", DesertSchema);
