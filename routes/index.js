var express = require('express');
var router = express.Router();

var blockChain = require('./blockchain');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
    // res.send('Hello ' + JSON.stringify(req.session));
});

module.exports = router;