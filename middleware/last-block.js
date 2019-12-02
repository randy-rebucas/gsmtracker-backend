const Blockchain = require('../models/blockchain');

module.exports = (req, res, next) => {
    try {
        let lastBlock = Blockchain.findOne({}, null, { sort: { _id: -1 }, limit: 1 });
        if (!lastBlock) {
            throw new Error('Something went wrong.Cannot get th last block!');
        }
        req.lastBlock = lastBlock;
        next();
    } catch (error) {
        res.status(401).json({ message: 'You are not authenticated!' });
    }
}