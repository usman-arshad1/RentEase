var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();


async function validateAnnouncement(announcement) {
	const resData = {};

	if (!announcement) {
		resData['announcementInvalid'] = 'Enter an announcement';
	} else if (announcement.length > 500) {
		resData['announcementInvalid'] = 'Enter an announcement up to 500 characters';
	}

	return resData;
}


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

		const messages = req.flash('messages')[0] || {};
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
			return res.render('announcement_LL', { properties: [], messages });
		} else {
			res.render('announcement_LL', { properties, messages });
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
	const existingToken = req.cookies.jwt;
	const resData = {};

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

			const { property_id, announcement } = req.body;
			const propertyIdInt = parseInt(property_id);

			const announcementErrors = await validateAnnouncement(announcement);

			if (Object.keys(announcementErrors).length > 0) {
					req.flash('messages', announcementErrors);
					return res.redirect('/landlord-announcements');
			}

			const newAnnouncement = await prisma.announcements.create({
					data: {
							announcement: announcement,
							property: propertyIdInt
					}
			});

			if (!newAnnouncement) {
					return res.status(400).json({ error: 'Failed to submit announcement' });
			}

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
					
			} else {
				resData['SubmissionSuccess'] = 'Announcement successfully submitted';
			}

			if (Object.keys(resData).length > 0) {
				req.flash('messages', resData);
				return res.redirect('/landlord-announcements');
			}

	} catch (err) {
			if (err.name === 'TokenExpiredError') {
					return res.redirect('/login');
			} else {
					console.error(err);
					return res.status(500).json({ error: 'Internal server error' });
			}
	}}


async function removeAnnouncement(req, res) {
	const existingToken = req.cookies.jwt;
	const resData = {};

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

			const { announcement_id } = req.body;
			const announcementIdInt = parseInt(announcement_id);

			const announcementToRemove = await prisma.announcements.findUnique({
					where: {
							announcement_id: announcementIdInt
					}
			});

			if (!announcementToRemove) {
					return res.status(400).json({ error: 'Announcement not found' });
			}

			await prisma.announcements.delete({
					where: {
							announcement_id: announcementIdInt
					}
			});
			resData['Removalsuccess'] = 'Announcement successfully removed';

			if (Object.keys(resData).length > 0) {
				req.flash('messages', resData);
				return res.redirect('/landlord-announcements');
			}
	} catch (err) {
			if (err.name === 'TokenExpiredError') {
					return res.redirect('/login');
			} else {
					console.error(err);
					res.status(500).json({ error: 'Internal server error' });
			}
	} finally {
		prisma.$disconnect();
	}
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
