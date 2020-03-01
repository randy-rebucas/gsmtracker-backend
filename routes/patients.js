const express = require('express');

const ctrlr = require('../controllers/patients');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', ctrlr.getAll);

router.get('/:id', ctrlr.getOne);

router.post('', ctrlr.create);

router.put('/:id', checkAuth, ctrlr.update);

router.delete('/:ids', checkAuth, ctrlr.delete);

router.get('/checkPhysicianExist/:physicianId/:patientId', ctrlr.checkPhysician);

router.get('/getByKey/:publicKey', ctrlr.getByKey);

module.exports = router;