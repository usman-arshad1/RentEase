const express = require("express");
const router = express.Router();

router.post("/", function (req, res, next) {
	res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
	res.redirect("/login");
});

module.exports = router;
