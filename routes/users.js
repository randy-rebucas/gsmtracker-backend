const express = require('express');
const router = express.Router();
/**
 * loads middlewares
 */
const authorization = require('../middleware/authorization');
/**
 * load controller
 */
const userController = require('../controllers/user');

router.get('', userController.getAll);

router.get('/:userId', userController.getOne);

router.post('', authorization, userController.create);

router.put('/:userId', userController.update);

router.delete('/:userId', authorization, userController.delete);


module.exports = router;