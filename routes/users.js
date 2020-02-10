const express = require('express');
const router = express.Router();
/**
 * loads middlewares
 */
const checkAuth = require('../middleware/check-auth');
const keygenerator = require('../middleware/keygenerator');
/**
 * load controller
 */
const userController = require('../controllers/user');

router.get('/search', userController.search);

router.get('/new', userController.getNewUser);

router.get('/birthdays', userController.getTodaysBirthday);

router.get('', userController.getAll);

router.get('/:userId', userController.getOne);

router.post('', checkAuth, keygenerator, userController.create);

router.put('/:userId', userController.update);

router.delete('/:userId', checkAuth, userController.delete);



module.exports = router;