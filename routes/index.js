var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RentEase Test' });
});

const userData = {
  first_name: 'John',
  last_name: 'Doe',
  password: 'hashedPassword',
  email: 'test@email.com', // You should hash the password before storing it
  role: 2
  // Other user properties as needed
};

async function createUser() {
  try {
    const createdUser = await prisma.user.create({
      data: userData,
    });

    console.log('User created:', createdUser);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = router;
