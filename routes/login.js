const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getAnnouncements = require("./announcement_tenant");
const getProperties = require("./property")

function generateJWT(user_id, email, role) {
	return jwt.sign({ user_id, email, role }, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});
}

function validateInput(email, password) {
	const resData = {};
	if (!email) {
		resData["emailInvalid"] = "Enter a valid email";
	} else if (email.length > 150) {
		resData["emailInvalid"] = "Enter an email up to 150 characters";
	}

	if (!password) {
		resData["passwordInvalid"] = "Enter a password";
	}

	return resData;
}

router.get("/", function (req, res, next) {
	const resData = {};

	if (req.url.includes("success")) {
		resData["signupSuccess"] = "Successfully created an account!";
	}

	res.render("login", { resData });
});

router.post("/", async function (req, res, next) {
	const { email, password } = req.body;
	const resData = validateInput(email, password);

	if (Object.keys(resData).length > 0) {
		res.status(400).render("login", { resData });
		return;
	}

	try {
		const existingUser = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!existingUser) {
			resData["emailInvalid"] = `Email is not registered`;
			return res.status(400).render("login", { resData });
		}

		const match = await bcrypt.compare(password, existingUser.password);

		if (match) {
			const token = generateJWT(
				existingUser.user_id,
				existingUser.email,
				existingUser.role
			);
			res.cookie("jwt", token, {
				maxAge: 3600000,
				httpOnly: true,
				sameSite: "none",
				secure: true,
			});
			if (existingUser.role === 1) {
				var properties = await getProperties(existingUser.user_id);
				return res.render("property", { properties });
			} else {
				var properties = await getAnnouncements(req, res);
				return res.render("announcement_tenant", { properties });
			}
		} else {
			resData["passwordInvalid"] = "Incorrect password";
			return res.status(400).render("login", { resData });
		}
	} catch (err) {
		console.log(err);
	} finally {
		prisma.$disconnect();
	}
});

module.exports = router;
