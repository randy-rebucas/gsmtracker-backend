const express = require('express');
const router = express.Router();
/**
 * loads middlewares
 */
const generateKey = require('../middleware/generate-key');
/**
 * load controller
 */
const authController = require('../controllers/auth');

router.post('/register', generateKey, authController.register);

router.post('/login', authController.login);

module.exports = router;
