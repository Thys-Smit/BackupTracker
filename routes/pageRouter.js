var path = require('path');
var express = require('express');
var router = express.Router();

//Client page.
router.get('/', function (req, res) {
    res.render(path.join(__dirname, '../views/index.html'));
});


module.exports = router;