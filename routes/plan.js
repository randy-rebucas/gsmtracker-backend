const express = require('express');

const Controller = require('../controllers/plan');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', Controller.getAll);

router.get('/:planId', Controller.get);

router.get('/slug/:slug', Controller.getBySlug);

router.post('', Controller.create);

router.put('/:planId', checkAuth, Controller.update);

router.delete('/:planId', checkAuth, Controller.delete);

module.exports = router;