const express = require('express');
const router = express.Router();
/**
 * load controller
 */
const blockchainCtrlr = require('../controllers/blockchain');

const mined = require('../middleware/mined-block');

router.get('', blockchainCtrlr.getChain);

router.post('', mined, blockchainCtrlr.createBlock);

module.exports = router;