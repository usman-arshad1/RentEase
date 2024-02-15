const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const database = require('../utils/database');
const jwt = require('jsonwebtoken');


function generateJWT(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function validateInput(email, password) {
  const resData = {};
  if (!email) {
    resData['emailInvalid'] = 'Email is required';
  }
  if (!password) {
    resData['passwordInvalid'] = 'Password is required';
  }
  return resData;
}

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', async function(req, res, next) {
  const { email, password } = req.body;
  const resData = validateInput(email, password);

  if (Object.keys(resData).length > 0) {
    res.status(400).render('login', { resData });
    return;
  }

  try {
    const userQueryResult = await database.start('SELECT * FROM user WHERE email = ?', [email]);

    if (userQueryResult.length === 0) {
      resData['emailInvalid'] = `Email ${email} is not registered`;
      res.status(400).render('login', { resData });
      return;
    }

    
    const user = userQueryResult[0]; 
    // Compare the password from the request with the hashed password from the database
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      console.log('Password is correct');
      const existingToken = req.cookies.jwt; // Check if the user already has a token
      const token = existingToken || generateJWT(email); // Use existing token or generate a new one
      // Set the token in the cookie
      res.cookie('jwt', token, { httpOnly: true });
      // Redirect to the home page
      res.redirect('/login?message=success');
    } else {
      resData['passwordInvalid'] = 'Incorrect password';
      res.status(400).render('login', { resData });
      return;
    }

  } catch (error) {
    console.log(error);
    res.status(500).render('login', { message: 'Internal server error' });
  }

});

module.exports = router;
