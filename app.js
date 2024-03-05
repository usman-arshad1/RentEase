var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
const port = process.env.PORT || 8080;

dotenv.config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var signupRouter = require("./routes/signup");
var loginRouter = require("./routes/login");
//Landlord User Route Config
var announcementLLRouter = require("./routes/announcement_LL");
var feedbackLLRouter = require("./routes/feedback_LL");
var propertyRouter = require("./routes/property");
var tenantListRouter = require("./routes/tenant_list");

//Tenant User Route Config
var announcementTenantRouter = require("./routes/announcement_tenant");
var feedbackTenantRouter = require("./routes/feedback_tenant");

//To Confirm if still required
var dashboardRouter = require("./routes/dashboard");
var addPropertyRouter = require("./routes/add_property");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);

// Landlord User Routes
app.use("/landlord-announcements", announcementLLRouter);
app.use("/landlord-feedback", feedbackLLRouter);
app.use("/landlord-properties", propertyRouter);
app.use("/landlord-tenant-list", tenantListRouter);

//Tenant User Routes
app.use("/tenant-announcements", announcementTenantRouter);
app.use("/tenant-feedback", feedbackTenantRouter);

app.use("/dashboard", dashboardRouter);
app.use("/add_property", addPropertyRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

app.listen(port, () => {
	console.log(`Rent Ease web app listening at http://localhost:${port}`);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
