const mongoose = require("mongoose");

MainCourseSchema = new mongoose.Schema({

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

    askBaking: {
        type: Boolean,
        default: false
    },

    baking: {
        type: String,
        default: null
    },

    askSauce: {
        type: Boolean,
        default: false,
    },

    sauce: {
        type: String,
        default: null
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

MainCourseSchema.pre("save", function(next) {
    this.updated_at = Date.now()
    next();
});

MainCourseSchema.methods.toJSON = function() {
    const obj = @toObject();
    return obj;
};

module.exports = mongoose.model("MainCourse", MainCourseSchema);
