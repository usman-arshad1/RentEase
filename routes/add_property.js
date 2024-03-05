var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('add_property', { title: 'Landlord Dashboard - Add property' });
});

module.exports = router;