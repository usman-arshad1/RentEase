var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
	res.render("tenant_list", { title: "List of Tenants" });
});

module.exports = router;
