const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const database = require('../utils/database');
const { roles } = require('../utils/enums');

function validateInput(email, password, role) {
  const resData = {};

  if (!email) {
    resData['emailInvalid'] = 'Please enter a valid email';
  }

  if (!password) {
    resData['passwordInvalid'] = 'Please enter a valid password';
  }

  if (!role) {
    resData['roleInvalid'] = 'Please select a valid role';
  }

  return resData;
}

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (err) {
    console.log(err);
  }
}

router.get('/', function (req, res, next) {
  res.render('signup');
});

router.post('/', async function (req, res, next) {
  const { email, password, role } = req.body;
  const resData = validateInput(email, password, role);

  if (Object.keys(resData).length > 0) {
    res.status(400).render('signup', { resData });
    return;
  }

  try {
    const selectResult = await database.execute('SELECT email FROM user WHERE email = ?', [email]);

    if (selectResult.length !== 0) {
      resData['emailInvalid'] = `Email ${email} has already been registered`;
      res.status(400).render('signup', { resData });
      return;
    }

    const insertResult = await database.execute('INSERT INTO user (email, `password`, `role`) VALUES (?, ?, ?)',
      [email, await hashPassword(password), roles[role]]);

    res.redirect('/login?message=success');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
