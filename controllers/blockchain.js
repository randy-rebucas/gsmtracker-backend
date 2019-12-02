const Blockchain = require('../models/blockchain');

const SHA256 = require('crypto-js/sha256');
const nonce = 0;
const difficulty = 4;

exports.mineBlock = () => {
    while (req.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        nonce++;
        hash = req.hash;
    }
}

// /**
//  * create genesis block for first instance of patient created
//  * * @param patient Address
//  */
// exports.createGenesisBlock = async(req, res, next) => {

//         let genesisBlock = {
//             patient: 'myaddress', // req.patientAddress
//             message: 'Genesis Block'
//         };

//         const newBlock = {
//             timestamp: req.timestamp,
//             previousHash: req.lastBlock.hash,
//             transactions: genesisBlock,
//             hash: req.calculateHash
//         };

//         let block = await newBlock.save();
//         if (!block) {
//             throw new Error('Something went wrong.Cannot save new block!');
//         }

//         next();
//     }
/**
 * get the last block of the chain
 */
// exports.getLastBlock = async(req, res, next) => {

//     let lastBlock = Blockchain.findOne({}, null, { sort: { _id: -1 }, limit: 1 });
//     if (!lastBlock) {
//         throw new Error('Something went wrong.Cannot get th last block!');
//     }

//     return lastBlock;
// }

exports.getChain = async(req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const query = Blockchain.find({ 'transaction.provider': req.query.providerKey });
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
            timestamp: req.timestamp,
            previousHash: req.lastBlock.hash,
            transactions: req.body.transactions,
            hash: req.calculateHash
        });

        let mineBlocked = await this.mineBlock();
        if (!mineBlocked) {
            throw new Error('Something went wrong.Cannot mined this block!');
        }

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