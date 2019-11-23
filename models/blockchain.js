// const mongoose = require('mongoose');
const mongoose = require('./../db/index');

const blockchainSchema = mongoose.Schema({
    timestamp: { type: Date, required: true, default: Date.now },
    transactions: { type: Array, required: true },
    previousHash: { type: String, required: false },
    hash: { type: String, required: true }
}, { strict: false });

module.exports = mongoose.model('Blockchain', blockchainSchema);