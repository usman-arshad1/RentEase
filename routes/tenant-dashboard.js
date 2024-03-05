var express = require('express');
var router = express.Router();

router.get('', function (req, res, next){
  res.render('tenant-dashboard', {title: 'Tenant Dashboard'})
})

module.exports = router;