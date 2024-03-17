const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const {forEach} = require('async');

function getDate() {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
  // console.log(curr_date); // "29-02-2024"
}

async function newFeedback(req, res) {
  const existingToken = req.cookies.jwt;
  const {title, category, description} = req.body;

  // console.log(title);
  // console.log(category);
  // console.log(description);

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
    const results = [];

    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });

		console.log(user);

		if (Object.is(user.property_fk, null)) {
			return res.redirect("/tenant-feedback");
		}

		let property = await prisma.properties.findUnique({
			where: {
				property_id: user.property_fk,
			},
		});

    const curr_date = getDate();
    // console.log(curr_date); // "29-02-2024"

		await prisma.feedback.create({
			data: {
				title: title,
				category: parseInt(category),
				description: description,
				date: curr_date,
				status: 1,
				property_fk: user.property_fk,
				user_id_fk: user.user_id,
			},
		});
		return res.redirect("/tenant-feedback");
	} catch (err) {
		console.log(err);
		if (err.name === "TokenExpiredError") {
			return res.redirect("/login");
		} else {
			console.error(err);
			return res.status(500).json({ error: "Internal server error" });
		}
	} finally {
		prisma.$disconnect();
	}
}

router.post("/", async function (req, res, next) {
	await newFeedback(req, res);
});

router.get('/', function(req, res, next) {
  res.render('new_feedback', {title: 'Tenant New Feedback'});
});

module.exports = router;
