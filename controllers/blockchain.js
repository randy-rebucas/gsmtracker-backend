const Blockchain = require('../models/blockchain');
const SHA256 = require('crypto-js/sha256');

exports.getChain = async(req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const query = Blockchain.find();
        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }
        let chains = await query.exec();
        res.status(200).json({
            chains: chains
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.create = async(req, res, next) => {
    try {
        console.log(req.body);
        /**
         * Set new patients type doc in Type Collection
         */
        const difficulty = 4;
        const timestamp = Date.parse(new Date().toJSON().slice(0, 10));
        let nonce = 0;

        const transactions = {
            setFrom: req.body.from, //Providers public key
            setTo: req.body.to, //patient public key
            message: `${req.body.name} new block chained.`, // Provider added a record on Patient
            records: req.body.transactions
        };

        const lastBlock = await Blockchain.findOne({}, null, { sort: { _id: -1 }, limit: 1 }).exec();
        const previousHash = lastBlock ? lastBlock.hash : '0';
        
        let hash = SHA256(JSON.stringify(transactions) + timestamp + previousHash + nonce).toString();
        
        while (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            nonce++;
            hash = SHA256(JSON.stringify(transactions) + timestamp + previousHash + nonce).toString();
        }

        const newBlock = new Blockchain({
            timestamp: timestamp,
            transactions: transactions,
            previousHash: previousHash,
            hash: hash,
            nonce: nonce
        });

        let block = await newBlock.save();
        if (!block) {
            throw new Error('Something went wrong.Cannot save new block!');
        }

        res.status(200).json({
            message: 'Block added successfully',
            blocks: {
                ...block,
                id: block._id,
            }
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getRecords = (req, res, next) => {
    try {

        let recordTransactions = Blockchain.findOne({ 'transactions.patient': req.params.patientAddress }).exec();
        if (!recordTransactions) {
            throw new Error('Something went wrong.No transactions on this block!');
        }

        res.status(200).json(recordTransactions.records);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}