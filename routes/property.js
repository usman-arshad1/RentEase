const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
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

async function getProperties(userId) {
    try {
        return await prisma.properties.findMany({
            where: {
                user_id: userId
            }
        });
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while fetching the properties");
    }
}

router.get("/", verifyLandlord, async function (req, res, next) {
    try {
        const currentUserId = req.user.user_id;
        const userProperties = await getProperties(currentUserId);
        res.render("property", {
            title: "Landlord Properties",
            properties: userProperties,
            userEmail: req.user.email
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching the properties");
    }
});

module.exports = router;
module.exports = getProperties;
