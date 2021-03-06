const express = require('express');

const ctrlr = require('../controllers/customer');

const authorization = require('../middleware/authorization');

const router = express.Router();

router.get('', ctrlr.getAll);

router.get('/lookup/:id', ctrlr.lookup);

router.get('/:id', ctrlr.getOne);

router.post('', ctrlr.create);

router.put('/:id', authorization, ctrlr.update);

router.delete('', authorization, ctrlr.delete);

module.exports = router;