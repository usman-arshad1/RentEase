var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

/**
 * Get the announcements for the tenant
 * @param {*} req  The request object
 * @param {*} res  The response object
 * @returns  The announcements for the tenant
 */

async function getAnnouncements(req, res) {
	const existingToken = req.cookies.jwt;

	if (!existingToken) {
			return res.redirect('/login');
	}

	try {
			const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);

			if (!decoded) {
					return res.redirect('/login');
			}
			const user = await prisma.user.findUnique({
					where: {
							user_id: decoded.user_id
					}
			});
			if (!user) {
					return res.status(400).json({ error: 'User not found' });
			}
			if (user.property_fk === null) {
					return res.render('announcement_tenant', { properties: [] });
			} else {
					const property = await prisma.properties.findUnique({
							where: {
									property_id: user.property_fk
							},
							include: {
									announcements: true
							}
					});

					if (!property) {
							return res.status(400).json({ error: 'Property not found' });
					}

					const properties = await prisma.properties.findMany({
						where: {
							property_id: user.property_fk
						},
						include: {
							announcements: true
						}
					});
					res.render('announcement_tenant', { properties });
			}
	} catch (err) {
			if (err.name === 'TokenExpiredError') {
					return res.redirect('/login');
			} else {
					console.error(err);
					return res.status(500).json({ error: 'Internal server error' });
			}
	}
}


router.get("/", async function (req, res, next) {
	await getAnnouncements(req, res);
});


module.exports = router;
