var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
	res.render("feedback_LL", { title: "Landlord Feedback" });
});

module.exports = router;
