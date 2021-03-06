const mongoose = require('../db/index');

const schema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    description: String,
    isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Owner', schema);