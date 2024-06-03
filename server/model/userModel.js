const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const { generateReferralCode } = require("../utilis/refreal");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    is_Verified: {
        type: Number,
        default: 0
    },
    is_Blocked: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: ''
    },
    wallet: {
        type: Number,
        default: 0
    },
    walletHistory: [{
        date: {
            type: Date
        },
        amount: {
            type: Number
        },
        description: {
            type: String
        }
    }],
    referralCode: { // Fixed field name
        type: String,
        unique: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

userSchema.pre('save', function(next) {
    if (!this.referralCode) {
        this.referralCode = generateReferralCode();
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
