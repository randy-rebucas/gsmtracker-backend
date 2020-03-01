const mongoose = require('../db/index');

const schema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    practice: String,
    yearsExperience: Number,
    description: String,
    prc: Number,
    ptr: Number,
    s2: Number,
    profesionalFee: Number,
    isVerified: { type: String, default: false }
});

module.exports = mongoose.model('Physicians', schema);
