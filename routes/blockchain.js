const express = require('express');
const router = express.Router();
/**
 * load controller
 */
const ctrlr = require('../controllers/blockchain');

const mined = require('../middleware/mined-block');

router.get('', ctrlr.getAll);

router.get('/user/:privateKey', ctrlr.getByUser);

router.get('/:id', ctrlr.getOne);

router.post('', mined, ctrlr.create); // 

module.exports = router;