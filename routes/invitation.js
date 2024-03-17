const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', function(req, res, next) {
  const token = req.query.token;
  const resData = {};

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.redirect('/login');
      }
    } else {
      try {
        await prisma.user.update({
          where: {
            user_id: decoded.tenant_id,
            role: 2,
          },
          data: {
            property_fk: decoded.property_id,
          },
        });

        resData['inviteSuccess'] = 'Successfully invited!';
        return res.render('invitation', {resData});
      } catch (err) {
        console.log(err);
      } finally {
        prisma.$disconnect();
      }
    }
  });
});

module.exports = router;
