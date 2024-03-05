const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

function validateInput(email) {
  const resData = {};

  if (!email) {
    resData['emailInvalid'] = 'Please enter a valid email';
  }

  return resData;
}

function sendEmail(email) {
  let returnValue = 0;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Yoo',
    text: 'Yoooooooo'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      returnValue = -1;
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  return returnValue;
}

router.get('/', function(req, res, next) {
  res.render('invite-remove-tenant');
});

router.post('/', async function (req, res, next) {
  const { email } = req.body;
  const resData = validateInput(email);

  if (Object.keys(resData).length > 0) {
    res.status(400).render('invite-remove-tenant', { resData });
    return;
  }

  if (sendEmail(email) === 0) {
    resData['success'] = true;
    res.render('invite-remove-tenant', { resData });
    return;
  }
});

module.exports = router;
