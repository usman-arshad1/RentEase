var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { forEach } = require("async");

async function newFeedback(req, res) {
	const existingToken = req.cookies.jwt;

	console.log(req.body);

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

		return res.redirect("/tenant_feedback");

		// 	const feedback = await prisma.feedback.findMany({
		// 		where: {
		// 			user_id_fk: user.user_id,
		// 		},
		// 		include: {
		// 			user: true,
		// 		},
		// 	});

		// 	console.log(feedback);

		// 	if (feedback.feedback_id === null) {
		// 		return res.render("feedback_tenant", { results: results });
		// 	}

		// 	const property = await prisma.properties.findMany({
		// 		where: {
		// 			property_id: feedback.property_fk,
		// 		},
		// 		include: {
		// 			feedback: true,
		// 		},
		// 	});

		// 	// console.log(property);

		// 	property.forEach((unit) => {
		// 		if (unit.feedback.length > 0) {
		// 			// console.log(unit);
		// 			// console.log(unit.feedback);
		// 			results.push(unit);
		// 		}
		// 	});

		// 	results.forEach((feedback) => {
		// 		console.log(feedback);
		// 	});

		// 	if (decoded.role == 1) {
		// 		res.render("feedback_tenant", {
		// 			title: "Tenant Feedback",
		// 			results: results,
		// 			username: username,
		// 		});
		// 	} else if (decoded.role == 2) {
		// 		return res.redirect("/landlord-feedback");
		// 	}
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
	// await newFeedback(req, res);
	console.log(req.body);
	res.redirect("/tenant-feedback");
});

router.get("/", function (req, res, next) {
	res.render("new_feedback", { title: "Tenant New Feedback" });
});

module.exports = router;
