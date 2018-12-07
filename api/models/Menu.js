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
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Starter"
        }],
        defaut: []
    },

    mainCourse: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "MainCourse"
        }],
        defaut: []
    },

    dessert: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dessert"
        }],
        defaut: []
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
