var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
	res.render("announcement_tenant", { title: "Tenant Announcements" });
});

module.exports = router;
