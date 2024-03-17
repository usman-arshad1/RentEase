const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function existingEmail(email) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return true;
  }

  return false;
}

async function validateInput(fname, lname, email, password, role) {
  const resData = {};

  if (!fname) {
    resData['fnameInvalid'] = 'Enter a first name';
  } else if (fname.length > 150) {
    resData['fnameInvalid'] = 'Enter a first name up to 150 characters';
  }

  if (!lname) {
    resData['lnameInvalid'] = 'Enter a last name';
  } else if (lname.length > 150) {
    resData['lnameInvalid'] = 'Enter a last name up to 150 characters';
  }

  if (!email) {
    resData['emailInvalid'] = 'Enter an email';
  } else if (email.length > 150) {
    resData['emailInvalid'] = 'Enter an email up to 150 characters';
  } else if (await existingEmail(email)) {
    resData['emailInvalid'] = `Email has already been registered`;
  }

  if (!password) {
    resData['passwordInvalid'] = 'Enter a password';
  }

  if (!role || (role !== 'landlord' && role !== 'tenant')) {
    resData['roleInvalid'] = 'Select a role';
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

router.get('/', function(req, res, next) {
  const errorMsgs = req.flash('errors')[0] || {};
  res.render('signup', {errorMsgs});
});

router.post('/', async function(req, res, next) {
  const {fname, lname, email, password, role} = req.body;
  const resData = await validateInput(fname, lname, email, password, role);

  if (Object.keys(resData).length > 0) {
    req.flash('errors', resData);
    return res.redirect('/signup');
  }

  try {
    await prisma.user.create({
      data: {
        first_name: fname,
        last_name: lname,
        email: email,
        password: await hashPassword(password),
        role: role === 'landlord' ? 1 : 2,
      },
    });

    return res.redirect('/login?message=success');
  } catch (err) {
    console.log(err);
  } finally {
    prisma.$disconnect();
  }
});

module.exports = router;
