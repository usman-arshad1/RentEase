const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

function generateJWT(user_id, email, role) {
  return jwt.sign({user_id, email, role}, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

async function registeredUser(email) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  return 'not-registered';
}

async function validateInput(email, password) {
  const resData = {};

  if (!email) {
    resData['emailInvalid'] = 'Enter an email';
    return resData;
  } else if (email.length > 150) {
    resData['emailInvalid'] = 'Enter an email up to 150 characters';
    return resData;
  }

  const result = await registeredUser(email);

  if (result === 'not-registered') {
    resData['emailInvalid'] = `Email is not registered`;
    return resData;
  }

  if (!password) {
    resData['passwordInvalid'] = 'Enter a password';
  } else if (await bcrypt.compare(password, result.password) === false) {
    resData['passwordInvalid'] = 'Incorrect password';
  }

  return resData;
}

router.get('/', function(req, res, next) {
  let successMsg = '';

  if (req.url.includes('success')) {
    successMsg = 'Account successfully created!';
  }

  const errorMsgs = req.flash('errors')[0] || {};

  res.render('login', {errorMsgs, successMsg});
});

router.post('/', async function(req, res, next) {
  const {email, password} = req.body;
  const resData = await validateInput(email, password);

  if (Object.keys(resData).length > 0) {
    req.flash('errors', resData);
    return res.redirect('/login');
  }

  try {
    const existingUser = await registeredUser(email);

    const token = generateJWT(
        existingUser.user_id,
        existingUser.email,
        existingUser.role,
    );

    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    if (existingUser.role === 1) {
      return res.redirect('/landlord-properties');
    } else {
      return res.redirect('/tenant-announcements');
    }
  } catch (err) {
    console.log(err);
  } finally {
    prisma.$disconnect();
  }
});


module.exports = router;
