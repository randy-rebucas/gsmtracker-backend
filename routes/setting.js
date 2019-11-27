const express = require('express');

const SettingController = require('../controllers/setting');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:userId', SettingController.getSetting);

router.put('/general', checkAuth, SettingController.updateGeneral);

router.put('/notification', checkAuth, SettingController.updateNotification);

module.exports = router;