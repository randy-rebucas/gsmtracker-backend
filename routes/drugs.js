const express = require('express');

const ctrlr = require('../controllers/drugs');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', ctrlr.getAll);

router.get('/:id', ctrlr.getOne);

router.post('', ctrlr.create);

router.put('/:id', checkAuth, ctrlr.update);

router.delete('/:id', checkAuth, ctrlr.delete);

module.exports = router;