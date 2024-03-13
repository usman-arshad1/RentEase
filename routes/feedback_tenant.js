var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

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

		if (decoded.role == 1) {
			return res.redirect("/landlord-feedback");
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
			switch(feedback[i].category){
				case 1:	
					feedback[i].category = "Structural";
					break;
				case 2:	
					feedback[i].category = "Safety";
					break;
				case 3:	
					feedback[i].category = "Cosmetic";
					break;
				case 4:	
					feedback[i].category = "Applicance";
					break;
				case 5:	
					feedback[i].category = "Other";
					break;
			}
			switch(feedback[i].status){
				case 1:	
					feedback[i].status = "Pending";
					break;
				case 2:	
					feedback[i].status = "In-Progress";
					break;
				case 3:	
					feedback[i].status = "Completed";
					break;
			}

			feedback[i].property_fk = property.unit + " " + property.street + ", " + property.city;
			results.push(feedback[i]);
			console.log("results length: " + results.length);
			// console.log(defect);
		}

		console.log(results);

		if (decoded.role == 2) {
			res.render("feedback_tenant", {
				title: "Tenant Feedback",
				results: results,
				username: username,
			});
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
