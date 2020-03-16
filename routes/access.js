const express = require('express');

const ctrlr = require('../controllers/access');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', ctrlr.getAll);

router.get('/checkAccess', ctrlr.checkAccess);

router.get('/getGrantedPhysician', ctrlr.getGrantPhysicians);

router.get('/:id', ctrlr.getOne);

router.post('', ctrlr.create);

router.put('/:id', checkAuth, ctrlr.update);

router.delete('/:id', checkAuth, ctrlr.delete);

module.exports = router;