var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
	res.render("new_feedback", { title: "Tenant New Feedback" });
});

module.exports = router;
