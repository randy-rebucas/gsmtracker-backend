const express = require('express');
const router = express.Router();
/**
 * loads middlewares
 */
const checkAuth = require('../middleware/check-auth');
const generateKey = require('../middleware/generate-key');
/**
 * load controller
 */
const userController = require('../controllers/user');

router.get('/search', userController.search);

router.get('/new', userController.getNewUser);

router.get('/birthdays', userController.getTodaysBirthday);

router.get('', userController.getAll);

router.get('/:userId', userController.getOne);

router.post('', checkAuth, generateKey, userController.create);

router.put('/:userId', userController.update);

router.put('/:userId/profile', userController.updateProfile);

router.delete('/:userId', checkAuth, userController.delete);



module.exports = router;