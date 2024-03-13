var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { forEach } = require("async");

async function getFeedback(req, res) {
	const existingToken = req.cookies.jwt;

	if (!existingToken) {
		console.log("user is not signed in.");
		return res.redirect("/login");
	}

	try {
		const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);

		if (!decoded) {
			console.log("user's token has expired.");
			return res.redirect("/login");
		}
		let results = [];

		const user = await prisma.user.findUnique({
			where: {
				email: decoded.email,
			},
		});

		let username = user.first_name + " " + user.last_name;

		const feedback = await prisma.feedback.findMany({
			where: {
				user_id_fk: user.user_id,
			},
			include: {
				user: true,
			},
		});

		console.log("feedback length " + feedback.length);

		if (feedback.length == 0) {
			return res.render("feedback_tenant", { results: results });
		}

		for (let i = 0; i < feedback.length; i++) {
			let property = await prisma.properties.findUnique({
				where: {
					property_id: feedback[i].property_fk,
				},
			});
			feedback[i].property_fk =
				property.unit + " " + property.street + ", " + property.city;
			results.push(feedback[i]);
			console.log("results length: " + results.length);
			// console.log(defect);
		}

		console.log(results);

		if (decoded.role == 1) {
			res.render("feedback_tenant", {
				title: "Tenant Feedback",
				results: results,
				username: username,
			});
		} else if (decoded.role == 2) {
			return res.redirect("/landlord-feedback");
		}
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

router.get("/", async function (req, res, next) {
	await getFeedback(req, res);
});

module.exports = router;
