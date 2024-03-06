const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const PrismaClient = require('@prisma/client');

function validateInput(fname, lname, email, password, role) {
  const resData = {};

  if (!fname) {
    resData['fnameInvalid'] = 'Please enter a first name';
  } else if (fname.length > 150) {
    resData['fnameInvalid'] = 'Please input a first name less than 151 characters';
  }

  if (!lname) {
    resData['lnameInvalid'] = 'Please enter a last name';
  } else if (lname.length > 150) {
    resData['lnameInvalid'] = 'Please input a last name less than 151 characters';
  }

  if (!email) {
    resData['emailInvalid'] = 'Please enter a valid email';
  } else if (email.length > 150) {
    resData['emailInvalid'] = 'Please input an email less than to 151 characters';
  }

  if (!password) {
    resData['passwordInvalid'] = 'Please enter a valid password';
  }

  if (!role || (role !== 'landlord' && role !== 'tenant')) {
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
  const { fname, lname, email, password, role } = req.body;
  const resData = validateInput(fname, lname, email, password, role);

  if (Object.keys(resData).length > 0) {
    res.status(400).render('signup', { resData });
    return;
  }

  try {
    const prisma = new PrismaClient();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (existingUser) {
      resData['emailInvalid'] = `Email ${email} has already been registered`;
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

    res.redirect('/login?message=success');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
