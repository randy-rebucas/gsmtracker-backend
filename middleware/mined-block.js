const SHA256 = require('crypto-js/sha256');
const Blockchain = require('../models/blockchain');

module.exports = async(req, res, next) => {
    try {
        const difficulty = 4;
        const timestamp = Date.parse(new Date().toJSON().slice(0, 10));

        const lastBlock = await Blockchain.findOne({}, null, { sort: { _id: -1 }, limit: 1 }).exec();
        const previousHash = lastBlock ? lastBlock.hash : '0';

        const transactions = {
            fromAddress: req.body.from, //Providers public key
            toAddress: req.body.to, //patient public key
            data: req.body.transactions
        };

        let nonce = 0;
        let hash = SHA256(JSON.stringify(transactions) + timestamp + previousHash + nonce).toString();

        while (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            nonce++;
            hash = SHA256(JSON.stringify(transactions) + timestamp + previousHash + nonce).toString();
        }

        req.timestamp = timestamp;
        req.transactions = transactions;
        req.previousHash = previousHash;
        req.hash = hash;
        req.nonce = nonce;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Unable to mined this record!' });
    }
}