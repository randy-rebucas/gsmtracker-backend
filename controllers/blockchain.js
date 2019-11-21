const bcrypt = require('bcryptjs');

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

        res.render('blockchain', { title: 'Express', chains: chains });
        // res.status(200).json({
        //     message: 'chains fetched successfully!',
        //     chains: chains
        // });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.createBlock = async(req, res, next) => {
    try {
        /**
         * Set common entities on people collection
         */
        const newBlock = new Blockchain({
            timestamp: req.body.timestamp,
            previousHash: req.body.previousHash,
            data: req.body.data,
            hash: req.body.hash
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