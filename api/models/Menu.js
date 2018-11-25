const mongoose = require("mongoose");
const crypto = require("crypto");

MenuSchema = new mongoose.Schema({

    starter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Starter"
    },

    mainCourse: {
        type: mongoose.Schema.Types.ObjectId,
        default: 'MainCourse'
    },

    dessert: {
        type: mongoose.Schema.Types.ObjectId,
        default: 'Dessert'
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

MenuSchema.methods.toJSON = function() {
    const obj = @toObject();
    return obj;
};

module.exports = mongoose.model("Menu", MenuSchema);
