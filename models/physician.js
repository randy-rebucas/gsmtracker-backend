const mongoose = require('../db/index');

const practiceSchema = mongoose.Schema({
    practice: { type: String, default: null },
    practiceYearExperience: { type: Number, default: null }
});

const schema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    practices: [practiceSchema],
    description: String,
    prc: { type: String, default: null },
    ptr: { type: String, default: null },
    s2: { type: String, default: null },
    professionalFee: { type: String },
    isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Physicians', schema);