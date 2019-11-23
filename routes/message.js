const express = require('express');

const MessageController = require('../controllers/message');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', MessageController.getAll);

router.get('/:messageId', MessageController.getOne);

router.post('', checkAuth, MessageController.create);

router.put('/:messageId', checkAuth, MessageController.update);

router.delete('/:messageId', checkAuth, MessageController.delete);


module.exports = router;
