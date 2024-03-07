const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function validateInput(email) {
	const resData = {};

	if (!email) {
		resData['emailInvalid'] = 'Please enter a valid email';
	}

	return resData;
}

function sendEmail(email) {
	let returnValue = 0;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		}
	});

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: 'Yoo',
		text: 'Yoooooooo'
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
			returnValue = -1;
		} else {
			console.log('Email sent: ' + info.response);
		}
	});

	return returnValue;
}

router.get("/", async function (req, res, next) {
	const resData = {};
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
				const properties = await prisma.properties.findMany({
					where: {
						user_id: decoded.user_id,
					},
					orderBy: {
						user_id: 'asc'
					}
				});

				const tenants = await prisma.user.findMany({
					where: {
						property_fk: {
							in: properties.map(property => property.property_id)
						}
					},
					orderBy: {
						property_fk: 'asc'
					}
				});

				const tenantResults = [];

				tenants.forEach(tenant => {
					const property = properties.find(property => property.property_id === tenant.property_fk);
					const combined = { ...property, ...tenant };
					combined.action = `landlord-tenant-list/remove/${combined.user_id}`;
					tenantResults.push(combined);
				});

				const propertyResults = await prisma.properties.findMany({
					where: {
						property_id: {
							notIn: tenants.map(tenant => tenant.property_fk)
						}
					}
				});

				resData['tenants'] = tenantResults;
				resData['properties'] = propertyResults;

				return res.render("tenant_list", { title: "List of Tenants - RentEase", resData });
			} catch (err) {
				console.log(err);
			} finally {
				prisma.$disconnect();
			}
		}
	});
});

router.get("/remove/:user_id", async function (req, res, next) {
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
						user_id: decoded.user_id
					}
				});

				const user = await prisma.user.findUnique({
					where: {
						user_id: userId
					}
				})

				const foundUser = properties.find(property => property.property_id == user.property_fk);

				if (foundUser) {
					await prisma.user.update({
						where: {
							user_id: user.user_id
						},
						data: {
							property_fk: null
						}
					})
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

router.post('/', async function (req, res, next) {
	const { email } = req.body;
	const resData = validateInput(email);

	// if (Object.keys(resData).length > 0) {
	// 	return res.status(400).render('tenant_list', { resData });
	// }

	if (sendEmail(email) === 0) {
		return res.redirect('/landlord-tenant-list');
	}
});

module.exports = router;
