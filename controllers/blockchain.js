const Blockchain = require('../models/blockchain');

exports.getAll = async(req, res, next) => {
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
        /**
         * Set new patients type doc in Type Collection
         */
        const newBlock = new Blockchain({
            timestamp: req.timestamp,
            transactions: req.transactions,
            previousHash: req.previousHash,
            hash: req.hash,
            nonce: req.nonce
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

exports.getOne = async(req, res, next) => {
    try {
        let data = await Blockchain.findById(req.params.id).exec();
        if (!data) {
            throw new Error('Something went wrong. Cannot be found blockchain Id: ' + req.params.id);
        }
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getByUser = async(req, res, next) => {
    try {
        const chains = await Blockchain.find({ 'transactions.toAddress': req.params.publicKey }).exec();
        if (!chains) {
            throw new Error('Something went wrong.No transactions on this block!');
        }
        res.status(200).json(chains);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}