// const mongoose = require('mongoose');
const mongoose = require('./../db/index');

const transactions = mongoose.Schema({
    fromAddress: String,
    toAddress: String,
    data: [mongoose.Schema.Types.Mixed]
});

const blockchainSchema = mongoose.Schema({
    timestamp: { type: Date, required: true, default: Date.now },
    transactions: transactions,
    previousHash: { type: String, required: false },
    hash: { type: String },
    nonce: Number
}, { strict: false });

module.exports = mongoose.model('Blockchain', blockchainSchema);