const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

				const results = [];

				tenants.map(tenant => {
					const property = properties.find(property => property.property_id === tenant.property_fk);
					const combined = {...property, ...tenant};
					combined.action = `landlord-tenant-list/remove/${combined.user_id}`;
					results.push(combined);
				});

				resData['tenants'] = results;

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

				return res.redirect('landlord-tenant-list');
			} catch (err) {
				console.log(err);
			} finally {
				prisma.$disconnect();
			}
		}
	});
});

module.exports = router;
