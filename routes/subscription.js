const express = require('express');

const Controller = require('../controllers/subscription');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', Controller.getAll);

router.get('/:subscriptionId', Controller.get);

router.get('/slug/:slug', Controller.getBySlug);

router.post('', Controller.create); //checkAuth, 

router.put('/:subscriptionId', checkAuth, Controller.update);

router.delete('/:subscriptionId', checkAuth, Controller.delete);

module.exports = router;