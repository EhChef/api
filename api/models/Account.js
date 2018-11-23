const mongoose = require('mongoose');
const crypto = require('crypto');

const AccountSchema = mongoose.Schema({

    fullname: {
        type: String,
        default: ''
    },

    email: {
        type: String,
        default: '',
        unique: true
    },

    password: {
        type: String,
        default: ''
    },

    salt: {
        type: String,
        default: ''
    },

    address: {
        type: String,
        default: ''
    },

    city: {
        type: String,
        default: ''
    },

    role: {
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
});

AccountSchema.statics.CLIENT = 0;
AccountSchema.statics.CHEF = 1;
AccountSchema.statics.SUPER_CHEF = 2;

// Crypt password on save
AccountSchema.pre("save", function(next) {
    this.updated_at = Date.now()
    if (this.isModified("password")) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.password = crypto.createHmac('sha256', this.salt).update(this.password).digest('hex');
    }
    next();
});

// Remove password from json
AccountSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model("Account", AccountSchema);
