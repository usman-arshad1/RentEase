var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
	res.render("announcement_LL", { title: "Landlord Announcements" });
});

module.exports = router;
