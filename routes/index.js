var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'gsm Tracker' });
    // res.send('Hello ' + JSON.stringify(req.session));
});

module.exports = router;