const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

function verifyLandlord(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 1) {
      return res.status(403).send('Access Denied / Not a landlord');
    }
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token');
  }
}


router.get('/', verifyLandlord, async function(req, res, next) {
  try {
    const currentUserId = req.user.user_id;
    const userProperties = await prisma.properties.findMany({
      where: {
        user_id: currentUserId,
      },
    });
    res.render('property', {
      title: 'Landlord Properties',
      properties: userProperties,
      userEmail: req.user.email,
    });
    console.log(req.user.email);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the properties');
  }
});

// Delete property
router.post('/:id', verifyLandlord, async (req, res) => {
  const {id} = req.params;

  try {
    await prisma.properties.delete({
      where: {
        property_id: parseInt(id),
      },
    });

    res.redirect('/landlord-properties');
  } catch (e) {
    res.status(500).send('Deletion failed');
  }
});

// Update property page
router.get('/update/:id', verifyLandlord, async (req, res) => {
  const {id} = req.params;
  const propertyId = parseInt(id);
  const userId = req.user.user_id;

  try {
    const currentProperty = await prisma.properties.findUnique({
      where: {
        property_id: propertyId,
        user_id: userId,
      },
    });
    if (!currentProperty) {
      res.status(500).send('You can only access to your own property');
    } else {
      res.render('update_property', {
        title: 'Update property',
        property: currentProperty,
      });
    }
  } catch (error) {
    res.status(500).send('Failed');
  }
});
// Update property
router.post('/update/:id', verifyLandlord, async (req, res)=> {
  const {id} = req.params;
  const {unit, street, city, provinceState, country} = req.body;
  try {
    const propertyId = parseInt(id);
    const propertyUnit = parseInt(unit);

    await prisma.properties.update({
      where: {
        property_id: propertyId,
      },
      data:
        {
          unit: propertyUnit,
          street: street,
          city: city,
          province_state: provinceState,
          country: country,
        },
    });
    res.redirect('/landlord-properties');
  } catch (e) {
    res.status(500).send('Update failed');
  }
});


module.exports = router;
