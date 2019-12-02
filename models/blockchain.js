// const mongoose = require('mongoose');
const mongoose = require('./../db/index');

const blockchainSchema = mongoose.Schema({
    timestamp: { type: Date, required: true, default: Date.now },
    transactions: mongoose.Schema.Types.Mixed,
    previousHash: { type: String, required: false },
    hash: { type: String },
    nonce: Number
}, { strict: false });

module.exports = mongoose.model('Blockchain', blockchainSchema);