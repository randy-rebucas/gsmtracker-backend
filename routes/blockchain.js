const express = require('express');
const router = express.Router();
/**
 * load controller
 */
const blockchainCtrlr = require('../controllers/blockchain');

router.get('', blockchainCtrlr.getChain);

router.post('', blockchainCtrlr.createBlock);

module.exports = router;