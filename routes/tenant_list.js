const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

function generateJWT(property_id, tenant_id) {
  return jwt.sign({property_id, tenant_id}, process.env.JWT_SECRET, {expiresIn: '12h'});
}

async function validateInput(email) {
  const resData = {};

  if (!email) {
    resData['emailInvalid'] = 'Enter an email';
    return resData;
  } else if (email.length > 150) {
    resData['emailInvalid'] = 'Enter an email up to 150 characters';
    return resData;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
      property_fk: null,
      role: 2,
    },
  });

  if (!user) {
    resData['emailInvalid'] = 'Tenant is already assigned to a property';
  }

  return resData;
}

function sendEmail(email, tenant_id, property) {
  let returnValue = 0;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const token = generateJWT(property.property_id, tenant_id);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Invite to Property',
    text: `Invite to ${property.unit} ${property.street}, ${property.city}, ${property.country}: http://localhost:8080/invitation?token=${token}`,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      returnValue = -1;
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  return returnValue;
}

router.get('/', async function(req, res, next) {
  const data = {};
  const existingToken = req.cookies.jwt;

  if (!existingToken) {
    return res.redirect('/login');
  }

  jwt.verify(existingToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.redirect('/login');
      }
    } else {
      if (decoded.role === 2) {
        return res.redirect('/');
      }

      try {
        const messages = req.flash('messages')[0] || {};

        const properties = await prisma.properties.findMany({
          where: {
            user_id: decoded.user_id,
          },
          orderBy: {
            user_id: 'asc',
          },
        });

        const tenants = await prisma.user.findMany({
          where: {
            property_fk: {
              in: properties.map((property) => property.property_id),
            },
          },
          orderBy: {
            property_fk: 'asc',
          },
        });

        const tenantResults = [];

        tenants.forEach((tenant) => {
          const property = properties.find((property) => property.property_id === tenant.property_fk);
          const combined = {...property, ...tenant};
          combined.action = `landlord-tenant-list/remove/${combined.user_id}`;
          tenantResults.push(combined);
        });

        const propertyResults = await prisma.properties.findMany({
          where: {
            property_id: {
              notIn: tenants.map((tenant) => tenant.property_fk),
            },
          },
        });

        data['tenants'] = tenantResults;
        data['properties'] = propertyResults;

        return res.render('tenant_list', {title: 'List of Tenants - RentEase', data, messages});
      } catch (err) {
        console.log(err);
      } finally {
        prisma.$disconnect();
      }
    }
  });
});

router.get('/remove/:user_id', async function(req, res, next) {
  const resData = {};
  const existingToken = req.cookies.jwt;
  const userId = parseInt(req.params.user_id, 10);

  if (isNaN(userId)) {
    return res.redirect('/landlord-tenant-list');
  }

  if (!existingToken) {
    return res.redirect('/login');
  }

  jwt.verify(existingToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.redirect('/login');
      }
    } else {
      if (decoded.role === 2) {
        return res.redirect('/');
      }

      try {
        const properties = await prisma.properties.findMany({
          where: {
            user_id: decoded.user_id,
          },
        });

        const user = await prisma.user.findUnique({
          where: {
            user_id: userId,
          },
        });

        const foundUser = properties.find((property) => property.property_id == user.property_fk);

        if (foundUser) {
          await prisma.user.update({
            where: {
              user_id: user.user_id,
            },
            data: {
              property_fk: null,
            },
          });

          resData['removeValid'] = 'Successfully removed tenant from the property!';
        }

        if (Object.keys(resData).length > 0) {
          req.flash('messages', resData);
          return res.redirect('/landlord-tenant-list');
        }

        return res.redirect('/landlord-tenant-list');
      } catch (err) {
        console.log(err);
      } finally {
        prisma.$disconnect();
      }
    }
  });
});

router.post('/', async function(req, res, next) {
  const {email, property} = req.body;
  const resData = await validateInput(email);
  const existingToken = req.cookies.jwt;
  const propertyId = parseInt(property, 10);

  if (!existingToken) {
    return res.redirect('/login');
  }

  jwt.verify(existingToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.redirect('/login');
      }
    } else {
      try {
        if (decoded.role === 2) {
          return res.redirect('/');
        }

        if (Object.keys(resData).length > 0) {
          req.flash('messages', resData);
          return res.redirect('/landlord-tenant-list');
        }

        const selectedProperty = await prisma.properties.findUnique({
          where: {
            property_id: propertyId,
          },
        });

        const user = await prisma.user.findUnique({
          where: {
            email: email,
            property_fk: null,
            role: 2,
          },
        });

        if (sendEmail(email, user.user_id, selectedProperty) === 0) {
          resData['emailSentValid'] = 'Successfully sent the email invitation!';
        }

        if (Object.keys(resData).length > 0) {
          req.flash('messages', resData);
          return res.redirect('/landlord-tenant-list');
        }
      } catch (err) {
        console.log(err);
      } finally {
        prisma.$disconnect();
      }
    }
  });
});

module.exports = router;
