const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
function verifyLandlord(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send('Access Denied / No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 1) {
      return res.status(403).send('Access Denied / Not a landlord');
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
}
router.get('/', verifyLandlord, function(req, res, next) {
  res.render('add_property', {title: 'Landlord Dashboard - Add property'});
});

// Create a new property
router.post('/', verifyLandlord, async (req, res) => {
  if (!req.user || !req.user.user_id) {
    return res.status(400).send('User or user_id is not defined');
  }
  try {
    let newProperty;
    // Extract the current user's ID from the request
    const currentUserId = req.user.user_id;

    // parseInt unit number
    const unitString = req.body.unit;
    const unit = parseInt(unitString);

    if (unit < 1 || isNan(unit)) {
      return res.status(400).send('Unit number must be a positive integer');
    }

    const {street, city, province_state, country} = req.body;
    // Create a new property
    newProperty = await prisma.properties.create({
      data: {
        unit: unit,
        street: street,
        city: city,
        province_state: province_state,
        country: country,
        user_id: currentUserId,
      },
    });

    return res.redirect('/landlord-properties');
  } catch (error) {
    console.error(error);
    return res.status(500).send('An error occurred while creating the property');
  }
});

module.exports = router;
