const mongoose = require('../db/index');

const practiceSchema = mongoose.Schema({
    title: { type: String, default: null }
});

const schema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    description: String,
    practices: [practiceSchema],
    prc: { type: String, default: null },
    ptr: { type: String, default: null },
    s2: { type: String, default: null },
    isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Physicians', schema);