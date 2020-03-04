const mongoose = require('../db/index');

const schema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    label: { type: String, required: true }
});

module.exports = mongoose.model('Labels', schema);
