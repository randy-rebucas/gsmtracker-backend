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

router.post('/register', keygenerator, authController.register);

router.post('/login', authController.login);

module.exports = router;