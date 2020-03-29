const express = require('express');
const router = express.Router();
/**
 * loads middlewares
 */
const keygenerator = require('../middleware/keygenerator');

/**
 * load controller
 */
const authController = require('../controllers/auth');

router.post('/generate', authController.generate);

router.post('/register', keygenerator, authController.register);

router.post('/login', authController.login);

router.get('/:id', authController.getOne);

router.put('/:userId', authController.update);

module.exports = router;