const express = require('express');
const router = express.Router();
/**
 * load controller
 */
const paymentController = require('../controllers/payment');

router.get('', paymentController.process);

// router.get('/:classificationId', paymentController.getOne);

router.post('', paymentController.create);

// router.put('/:classificationId', paymentController.update);

// router.delete('/:classificationId', paymentController.delete);

module.exports = router;
