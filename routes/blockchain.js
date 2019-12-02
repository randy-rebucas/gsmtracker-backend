const express = require('express');
const router = express.Router();
/**
 * load controller
 */
const blockchainCtrlr = require('../controllers/blockchain');

const lastblock = require('../middleware/last-block');
const calculate = require('../middleware/calculate-hash');

router.get('', blockchainCtrlr.getChain);

router.post('', lastblock, calculate, blockchainCtrlr.createBlock);

module.exports = router;