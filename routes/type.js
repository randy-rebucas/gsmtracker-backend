const express = require('express');

const Controller = require('../controllers/type');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', Controller.getAll);

router.get('/:typeId', Controller.get);

router.get('/slug/:slug', Controller.getBySlug);

router.post('', checkAuth, Controller.create);

router.put('/:typeId', checkAuth, Controller.update);

router.delete('/:typeId', checkAuth, Controller.delete);

module.exports = router;