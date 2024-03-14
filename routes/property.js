const express = require("express");
const router = express.Router();
const { PrismaClient} = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

function verifyLandlord(req, res, next) {
	const token = req.cookies.jwt;
	if (!token) {
		return res.status(401).send("Access Denied / No token provided");
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded.role !== 1) {
			return res.status(403).send("Access Denied / Not a landlord");
		}
		req.user = decoded;
		next();
	} catch (ex) {
		res.status(400).send("Invalid token");
	}
}

router.get("/", verifyLandlord, async function (req, res, next) {
	try {
		// Extract the current user's ID from the request
		const currentUserId = req.user.user_id;

		// Fetch properties associated with the current user
		const userProperties = await prisma.properties.findMany({
			where: {
				user_id: currentUserId
			}
		});

		// Render the page with the fetched properties
		res.render("property", {
			title: "Landlord Properties",
			properties: userProperties,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("An error occurred while fetching the properties");
	}
});

// Deletion
router.post("/:id", verifyLandlord, async (req, res) => {
	const {id} =  req.params;
	try {
		await prisma.properties.delete({
			where:{
				property_id:parseInt(id),
			},
		});
		res.redirect("/landlord-properties")
	} catch(e) {
		res.status(500).send("Deletion failed")
	}
})


router.get("/update/:id", verifyLandlord, async (req, res) => {
	const {id} = req.params;
	try {
		const property_id = parseInt(id);
		const currentProperty = await prisma.properties.findUnique({
			where: {
				property_id: property_id
			}
		})
		res.render("update_property", {
			title: "Update property",
			property: currentProperty
		})
	} catch (error) {
		res.status(500).send("Failed");
	}
})
// Update
router.post("/update/:id", verifyLandlord, async (req, res)=> {
	const {id} = req.params
	const {unit, street, city, province_state, country} = req.body
	try {
		const property_id = parseInt(id);
		const property_unit = parseInt(unit);

		const updateProperty = await prisma.properties.update({
			where: {
				property_id: property_id
			},
			data:
				{
					unit:property_unit,
					street: street,
					city: city,
					province_state: province_state,
					country: country
				},
		})
		res.redirect("/landlord-properties")
	} catch(e) {
		res.status(500).send("Update failed")
	}
})

module.exports = router;
