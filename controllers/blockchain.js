const Blockchain = require('../models/blockchain');

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

exports.createBlock = async(req, res, next) => {
    try {
        const newBlock = new Blockchain({
            timestamp: req.body.timestamp,
            transactions: req.body.transactions,
            previousHash: req.body.previousHash,
            hash: req.body.hash,
            nonce: req.body.nonce
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