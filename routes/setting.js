const express = require('express');

const SettingController = require('../controllers/setting');

const authorization = require('../middleware/authorization');

const router = express.Router();

router.get('/:userId', SettingController.get);

router.put('/:userId', authorization, SettingController.update);

module.exports = router;