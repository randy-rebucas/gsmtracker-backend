const express = require('express');

const QueController = require('../controllers/queing');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, QueController.create);

router.get('', QueController.getAll);

router.get('/:patientId', QueController.checkOnQue);

router.delete('/:queingId', checkAuth, QueController.delete);

router.delete('/clear/', checkAuth, QueController.deleteAll);

router.delete('/smooth/:patientId', checkAuth, QueController.deleteSmooth);

router.delete('/cancel/:patientId', checkAuth, QueController.deleteCanceled);

module.exports = router;