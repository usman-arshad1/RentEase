var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
	res.render("feedback_tenant", { title: "Tenant Feedback" });
});

module.exports = router;
