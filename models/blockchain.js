// const mongoose = require('mongoose');
const mongoose = require('./../db/index');

const blockSchema = mongoose.Schema({
    timestamp: { type: String, required: true },
    previousHash: { type: String, required: true },
    data: [mongoose.Schema.Types.Mixed],
    hash: { type: String, required: true }
}, { strict: false });

module.exports = mongoose.model('blocks', blockSchema);