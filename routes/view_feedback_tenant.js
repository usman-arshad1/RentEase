const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

async function viewFeedback(req, res) { 
  const existingToken = req.cookies.jwt;

  if (!existingToken) {
    console.log('user is not signed in.');
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);

    if (!decoded) {
      console.log('user\'s token has expired.');
      return res.redirect('/login');
    }

    if (decoded.role == 1) {
      return res.redirect('/landlord-feedback');
    }

    // POSSIBLE SECURITY RISK USING REQ.PARAMS
    const feedback = await prisma.feedback.findUnique({
      where: {
        feedback_id: parseInt(req.params.feedback),
      },
    });

    console.log(feedback);

    const property = await prisma.properties.findUnique({
      where: {
        property_id: feedback.property_fk,
      },
    });

    feedback.property_fk = property.unit + ' ' +
                           property.street + ', ' +
                           property.city;

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

    res.render('view_feedback_tenant', {
      title: 'Tenant Feedback Details',
      results: feedback,
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

router.get('/:feedback', async function(req, res, next) {
  await viewFeedback(req, res);
});

module.exports = router;
