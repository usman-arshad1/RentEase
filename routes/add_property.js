var express = require('express');
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get('/', function(req, res, next) {
  res.render('add_property', { title: 'Landlord Dashboard - Add property' });
});

// Create a new property
router.post('/', async (req, res) => {
  let newProperty; // Declare newProperty outside try-catch block for broader scope
  try {
    // Get data from body
    // The 'user_id' field should not be filled in by the user.
    // Instead, it should be set on the server-side after verifying the user's identity.
    // For now, user id is set to 5 which is "landlord test".
    const {unit, street, city, province_state, country} = req.body;

    // Create a new property
    newProperty = await prisma.properties.create({
      data: {
        unit: unit,
        street: street,
        city: city,
        province_state: province_state,
        country: country,
        user_id: 5
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while creating the property");
  }

  // Send response
  return res.json(newProperty);
});

module.exports = router;
