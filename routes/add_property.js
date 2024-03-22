const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

/**
 * Verifies if the user is a landlord
 * by checking the token in the request cookies.
 * If the user is not a landlord or the token is invalid,
 * it returns an appropriate response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {res} Calls the next middleware function
 * if the token is valid and the user is a landlord;
 *         sends a redirection response
 *         if the token is missing;
 *         sends access denied response
 *         if the token is invalid or the user is not a landlord;
 *         sends an invalid token response
 *         if there is an error verifying the token.
 */
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
    // Extract the current user's ID from the request
    const currentUserId = req.user.user_id;

    // parseInt unit number
    const unitString = req.body.unit;
    const unit = parseInt(unitString);

    // Validate if number is positive
    if (unit < 1 || !unit) {
      return res.status(400).send('Unit number must be a positive integer');
    }

    const {street, city, provinceState, country} = req.body;
    // Create a new property
    await prisma.properties.create({
      data: {
        unit: unit,
        street: street,
        city: city,
        province_state: provinceState,
        country: country,
        user_id: currentUserId,
      },
    });

    return res.redirect('/landlord-properties');
  } catch (error) {
    console.error(error);
    return res
        .status(500)
        .send('An error occurred while creating the property');
  }
});

module.exports = router;
