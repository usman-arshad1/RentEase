var express = require("express");
var router = express.Router();
const { PrismaClient} = require("@prisma/client");
const session = require("express-session");
const prisma = new PrismaClient();

router.get("/", async function (req, res, next) {
	// For now, user id is set to 5
	// Implement function to get current session's user ID
	const current_user_id = 5
	const userProperties = await prisma.properties.findMany({
		where: {
			user_id: current_user_id
		}
	})
	res.render("property", {
		title: "Landlord Properties",
		properties: userProperties
	});
});

module.exports = router;
