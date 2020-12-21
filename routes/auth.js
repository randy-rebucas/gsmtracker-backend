const express = require('express');
const router = express.Router();
/**
 * load controller
 */
const authController = require('../controllers/auth');

router.post('/generate', authController.generate);

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/:id', authController.getOne);

router.put('/:userId', authController.update);

module.exports = router;