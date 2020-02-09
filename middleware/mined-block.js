const SHA256 = require('crypto-js/sha256');
const Blockchain = require('../models/blockchain');

module.exports = async(req, res, next) => {
    try {
        const difficulty = 4;
        const timestamp = Date.parse(new Date().toJSON().slice(0, 10));

        const lastBlock = await Blockchain.findOne({}, null, { sort: { _id: -1 }, limit: 1 }).exec();
        const previousHash = lastBlock ? lastBlock.hash : '0';

        // const transactions = {
        //     from: req.fromAddress, //providers public key
        //     to: req.toAddress, //patient public key
        //     message: `${req.privateKey} chained in block.`,
        //     records: [
        //         { height: { value: 5 + 5, hasUnit: true, unit: 'cm' } },
        //         { weight: { value: 1 * 9, hasUnit: true, unit: 'kg' } }, 
        //         { temperature: { value: 34, hasUnit: true, unit: '°C' } }
        //     ]
        // };
        const transactions = {
            setFrom: req.body.from, //Providers public key
            setTo: req.body.to, //patient public key
            message: `${req.body.name} new block chained.`, // Provider added a record on Patient
            records: req.body.transactions
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