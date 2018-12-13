const mongoose = require("mongoose");

MenuSchema = new mongoose.Schema({

    name: {
        type: String,
        default: ''
    },

    price: {
        type: Number,
        default: 0
    },

    starter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Starter"
    },

    mainCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MainCourse"
    },

    dessert: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dessert"
    },

    available: {
        type: Boolean,
        default: true
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

MenuSchema.pre("save", function(next) {
    this.updated_at = Date.now()
    next();
});

MenuSchema.methods.toJSON = function() {
    const obj = this.toObject();
    return obj;
};

module.exports = mongoose.model("Menu", MenuSchema);
