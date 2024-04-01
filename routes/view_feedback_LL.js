const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

function getDate() {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
  // console.log(curr_date); // "29-02-2024"
}

async function validateInput(update) {
  const resData = {};

  if (!update) {
    resData['updateInvalid'] = 'Enter an update';
    return resData;
  } else if (update.length < 9) {
    resData['updateInvalid'] = 'Enter an update with a minimum of 10 characters';
    return resData;
  }

  return resData;
}

async function viewFeedback(req, res) {
  const existingToken = req.cookies.jwt;

  if (!existingToken) {
    console.log('user is not signed in.');
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);
    console.log(decoded);
    if (!decoded) {
      console.log('user\'s token has expired.');
      return res.redirect('/login');
    }

    if (decoded.role == 2) {
      return res.redirect('/tenant-feedback');
    }

    const feedback = await prisma.feedback.findUnique({
      where: {
        feedback_id: parseInt(req.params.feedback),
      },
    });

    console.log(feedback);

    const user = await prisma.user.findUnique({
      where: {
        user_id: feedback.user_id_fk,
      },
    });

    feedback.user_id_fk = user.first_name + ' ' + user.last_name;

    const property = await prisma.properties.findUnique({
      where: {
        property_id: feedback.property_fk,
      },
    });

    feedback.property_fk =
			property.unit + ' ' + property.street + ', ' + property.city;

    switch (feedback.category) {
      case 1:
        feedback.category = 'Structural';
        break;
      case 2:
        feedback.category = 'Safety';
        break;
      case 3:
        feedback.category = 'Cosmetic';
        break;
      case 4:
        feedback.category = 'Applicance';
        break;
      case 5:
        feedback.category = 'Other';
        break;
    }
  const errorMsgs = req.flash('errors')[0] || {};

    res.render('view_feedback_LL', {
      title: 'Landlord Feedback Details',
      results: feedback,
      errorMsgs
    });
  } catch (err) {
    console.log(err);
    if (err.name === 'TokenExpiredError') {
      return res.redirect('/login');
    } else {
      console.error(err);
      return res.status(500).json({error: 'Internal server error'});
    }
  } finally {
    prisma.$disconnect();
  }
}

async function addUpdate(req, res) {
  console.log(req.params);
  console.log(req.body);

  const curr_date = getDate();

  const feedback_id = parseInt(req.params.feedback);
  const status = parseInt(req.body.status);
  const update = curr_date + ': ' + req.body.update;

  try {
    const addUpdate = await prisma.feedback.update({
      where: {
        feedback_id: feedback_id,
      },
      data: {
        status: status,
        update: update,
      },
    });

    res.redirect('/landlord-feedback');
  } catch (err) {
    console.log(err);
    if (err.name === 'TokenExpiredError') {
      return res.redirect('/login');
    } else {
      console.error(err);
      return res.status(500).json({error: 'Internal server error'});
    }
  } finally {
    prisma.$disconnect();
  }
}

router.post('/:feedback', async function(req, res, next) {
  const {update} = req.body;
  const resData = await validateInput(update);
  const feedback_id = req.params.feedback;

  if (Object.keys(resData).length > 0) {
    req.flash('errors', resData);
    return res.redirect('/landlord-view-feedback/'+ feedback_id);
  }
  await addUpdate(req, res);
});

router.get('/:feedback', async function(req, res, next) {
  await viewFeedback(req, res);
});

module.exports = router;
