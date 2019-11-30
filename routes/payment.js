const express = require('express');

const Controller = require('../controllers/payment');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', Controller.getAll);

router.get('/:paymentId', Controller.get);

router.post('', Controller.create);

router.put('/:paymentId', checkAuth, Controller.update);

router.delete('/:paymentId', checkAuth, Controller.delete);

module.exports = router;