const express = require('express');

const SettingController = require('../controllers/setting');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/my-settings/:userId', SettingController.get);

router.get('/:userId', SettingController.getSetting);

router.put('/general', checkAuth, SettingController.updateGeneral);

router.put('/notification', checkAuth, SettingController.updateNotification);

router.put('/subscription', checkAuth, SettingController.updateSubscription);

module.exports = router;