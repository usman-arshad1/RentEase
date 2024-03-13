const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function validateInput(fname, lname, email, password, role) {
  const resData = {};

  if (!fname) {
    resData['fnameInvalid'] = 'Enter a first name';
  } else if (fname.length > 150) {
    resData['fnameInvalid'] = 'Enter a first name up to 150 characters';
  }

  if (!lname) {
    resData['lnameInvalid'] = 'Please enter a last name';
  } else if (lname.length > 150) {
    resData['lnameInvalid'] = 'Enter a last name up to 150 characters';
  }

  if (!email) {
    resData['emailInvalid'] = 'Enter a valid email';
  } else if (email.length > 150) {
    resData['emailInvalid'] = 'Enter an email up to 150 characters';
  }

  if (!password) {
    resData['passwordInvalid'] = 'Enter a valid password';
  }

  if (!role || (role !== 'landlord' && role !== 'tenant')) {
    resData['roleInvalid'] = 'Select a valid role';
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
  const { fname, lname, email, password, role } = req.body;
  const resData = validateInput(fname, lname, email, password, role);

  if (Object.keys(resData).length > 0) {
    res.status(400).render('signup', { resData });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (existingUser) {
      resData['emailInvalid'] = `Email has already been registered`;
      res.status(400).render('signup', { resData });
      return;
    }

    await prisma.user.create({
      data: {
        first_name: fname,
        last_name: lname,
        email: email,
        password: await hashPassword(password),
        role: role === 'landlord' ? 1 : 2
      }
    });
  

    return res.redirect('/login?message=success');
  } catch(err) {
    console.log(err);
  } finally {
    prisma.$disconnect();
  }
});

module.exports = router;
