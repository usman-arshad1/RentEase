const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('dashboard', {title: 'Landlord Dashboard'});
});

module.exports = router;
