const mongoose = require("mongoose");

MainCourseSchema = new mongoose.Schema({

    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },

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

    askSauce: {
        type: Boolean,
        default: false,
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
});

MainCourseSchema.pre("save", function(next) {
    this.updated_at = Date.now()
    next();
});

MainCourseSchema.methods.toJSON = function() {
    const obj = this.toObject();
    return obj;
};

module.exports = mongoose.model("MainCourse", MainCourseSchema);
