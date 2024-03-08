var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

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

		const user = await prisma.user.findUnique({
			where: {
				user_id: decoded.user_id
			}
		});

		if (!user) {
			return res.status(400).json({ error: 'User not found' });
		}

		const properties = await prisma.properties.findMany({
			where: {
				user_id: user.user_id
			},
			include: {
				announcements: true
			}
		});

		if (properties.length === 0) {
			return res.render('announcement_LL', { properties: [] });
		} else {
			res.render('announcement_LL', { properties });
		}
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.redirect('/login');
		}
	}

}


/**
 * Submit an announcement
 * @param {*} req  The request object
 * @param {*} res  The response object
 * @returns  The updated list of properties
 */
async function submitAnnouncement(req, res) {
	const { property_id, announcement } = req.body;
	const propertyIdInt = parseInt(property_id);
	const newAnnouncement = await prisma.announcements.create({
		data: {
			announcement: announcement,
			property: propertyIdInt
		}
	});
	if (!newAnnouncement) {
		return res.status(400).json({ error: 'Failed to submit announcement' });
	}
	// Update the property to include the announcement
	const updatedProperty = await prisma.properties.update({
		where: {
			property_id: propertyIdInt
		},
		data: {
			announcements: {
				connect: {
					announcement_id: newAnnouncement.announcement_id
				}
			}
		}
	});
	if (!updatedProperty) {
		return res.status(400).json({ error: 'Failed to update property' });
	}
	// Get the updated list of properties
	const properties = await getAnnouncements(req, res);
	res.render('announcement_LL', { properties });
}

async function removeAnnouncement(req, res) {
	const { announcement_id } = req.body;
	const announcementIdInt = parseInt(announcement_id);
	// Find the announcement to be removed
	const announcementToRemove = await prisma.announcements.findUnique({
		where: {
			announcement_id: announcementIdInt
		}
	});
	if (!announcementToRemove) {
		return res.status(400).json({ error: 'Announcement not found' });
	}
	// Remove the announcement
	await prisma.announcements.delete({
		where: {
			announcement_id: announcementIdInt
		}
	});
	// Get the updated list of properties
	const properties = await getAnnouncements(req, res);
	res.render('announcement_LL', { properties });
}



router.post("/", async function (req, res, next) {
	if (req.body.announcement_id) {
		// Request is for removing an announcement
		await removeAnnouncement(req, res);
	} else {
		// Request is for submitting a new announcement
		await submitAnnouncement(req, res);
	}
});


router.get("/", async function (req, res, next) {
	await getAnnouncements(req, res);
});

module.exports = router;
