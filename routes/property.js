var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
	res.render("property", { title: "Landlord Properties" });
});

module.exports = router;
