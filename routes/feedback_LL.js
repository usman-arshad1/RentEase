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

		if (decoded.role == 2) {
			return res.redirect("/tenant-feedback");
		}

		let results = [];

		const user = await prisma.user.findUnique({
			where: {
				email: decoded.email,
			},
		});

		let username = user.first_name + " " + user.last_name;
		console.log(user);

		//FIRST GET USER PROPERTY LIST
		//THEN GET THE FEEDBACK FOR EACH PROPERTY

		let property = await prisma.properties.findMany({
			where: {
				user_id: user.user_id,
			},
		});
		console.log("property length: " + property.length);
		console.log(property);

		if (property.length == 0) {
			return res.render("feedback_LL", { results: results });
		}

		let feedback = await prisma.feedback.findMany({
			where: {
				property_fk: property.property_id,
			}
		});

		let users = await prisma.user.findMany({
			where: {
				property_fk: property.property_id,
			}
		});
		
		console.log("feedback length: " + feedback.length);
		console.log(feedback);

		if (feedback.length == 0) {
			return res.render("feedback_LL", { results: results });
		}

		for (let i = 0; i < property.length; i++) {
			for (let j = 0; j < feedback.length; j++) {
				if(property[i].property_id == feedback[j].property_fk){
					let user = await prisma.user.findUnique({
						where: {
							user_id: feedback[j].user_id_fk
						}
					});
					feedback[j].user_id_fk = user.first_name + ", " + user.last_name;
					feedback[j].property_fk = property[i].unit + " " + property[i].street + ", " + property[i].city;
					results.push(feedback[j]);
				}
				
			}
			
			console.log("results length: " + results.length);
		}

		console.log(results);

		if (decoded.role == 1) {
			res.render("feedback_LL", {
				title: "Landlord Feedback",
				results: results,
				username: "username",
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
