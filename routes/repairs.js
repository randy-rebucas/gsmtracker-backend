const express = require('express');

const ctrlr = require('../controllers/repairs');

const authorization = require('../middleware/authorization');

const router = express.Router();

router.get('', ctrlr.getAll);

router.get('/:id', ctrlr.getOne);

router.post('', ctrlr.create);

router.put('/:id', authorization, ctrlr.update);

router.delete('/:ids', authorization, ctrlr.delete);

router.get('/checkOwnerExist/:ownerId/:repairId', ctrlr.checkOwner);

router.get('/setLabel/:repairId/:labels', ctrlr.setLabel);

module.exports = router;