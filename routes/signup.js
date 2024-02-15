var express = require('express');
var router = express.Router();

function validateInput(data) {
  const { email, password, role } = data;
  const resData = {};

  if (!email) {
    resData['emailInvalid'] = 'Please enter a valid email';
  }

  if (!password) {
    resData['passwordInvalid'] = 'Please enter a valid password';
  }

  if (!role) {
    resData['roleInvalid'] = 'Please enter a valid role';
  }

  return resData;
}

router.get('/', function (req, res, next) {
  res.render('signup');
});

router.post('/', function (req, res, next) {
  const resData = validateInput(req.body);

  if (Object.keys(resData).length > 0) {
    res.status(400).render('signup', { resData });
    return;
  }

  res.redirect('/login?message=success');
});

module.exports = router;
