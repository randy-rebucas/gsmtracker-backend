const express = require('express');
const router = express.Router();
/**
 * load controller
 */
const uploadController = require('../controllers/upload');

// router.get('', userController.getAll);

router.get('/:sourceId', uploadController.getOne);

router.post('', uploadController.create);

// router.put('/:uploadId', userController.update);

// router.delete('/:uploadId', checkAuth, userController.delete);

module.exports = router;