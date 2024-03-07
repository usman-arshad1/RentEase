var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function getAnnouncements(req, res) {
	const user = await prisma.user.findUnique({
			where: {
					email: "jane.smith@example.com" //decoded.email
			}
	});
	if (!user) {
			return res.status(400).json({ error: 'User not found' });
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


router.get("/", async function (req, res, next) {
	await getAnnouncements(req, res);
});


module.exports = router;
