const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

function generateJWT(email, role) {
  return jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function validateInput(email, password) {
  const resData = {};
  if (!email) {
    resData['emailInvalid'] = 'Enter a valid email';
  } else if (email.length > 150) {
    resData['emailInvalid'] = 'Enter an email up to 150 characters';
  }

  if (!password) {
    resData['passwordInvalid'] = 'Enter a password';
  }

  return resData;
}

router.get('/', function(req, res, next) {
  const resData = {};

  if (req.url.includes('success')) {
    resData['signupSuccess'] = 'Successfully created an account!';
  }

  res.render('login', { resData });
});

router.post('/', async function(req, res, next) {
  const { email, password } = req.body;
  const resData = validateInput(email, password);

  if (Object.keys(resData).length > 0) {
    res.status(400).render('login', { resData });
    return;
  }

  try {
    const prisma = new PrismaClient();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (!existingUser) {
      resData['emailInvalid'] = `Email is not registered`;
      res.status(400).render('login', { resData });
      return;
    }

    const match = await bcrypt.compare(password, existingUser.password);

    if (match) {
      const existingToken = req.cookies.jwt;
      const token = existingToken || generateJWT(existingUser.email, existingUser.role);
      res.cookie('jwt', token, { httpOnly: true });
      res.render('index', { title: 'RentEase Test' });
      return;
    } else {
      resData['passwordInvalid'] = 'Incorrect password';
      res.status(400).render('login', { resData });
      return;
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
