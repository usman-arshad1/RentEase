const createError = require('http-errors');
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const port = process.env.PORT || 8080;
const methodOverride = require("method-override")

dotenv.config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const invitationRouter = require('./routes/invitation');
const signoutRouter = require('./routes/signout');
// Landlord User Route Config
const announcementLLRouter = require('./routes/announcement_LL');
const feedbackLLRouter = require('./routes/feedback_LL');
const viewFeedbackLLRouter = require('./routes/view_feedback_LL');
const propertyRouter = require('./routes/property');
const tenantListRouter = require('./routes/tenant_list');

// Tenant User Route Config
const announcementTenantRouter = require('./routes/announcement_tenant');
const feedbackTenantRouter = require('./routes/feedback_tenant');
const viewFeedbackTenantRouter = require('./routes/view_feedback_tenant');
const newFeedbackTenantRouter = require('./routes/new_feedback');

// To Confirm if still required
const dashboardRouter = require('./routes/dashboard');
const addPropertyRouter = require('./routes/add_property');

const app = express();

if (global.__coverage__) {
  console.log('have code coverage, will add middleware for express');
  console.log(`to fetch: GET :${port}/__coverage__`);
  require('@cypress/code-coverage/middleware/express')(app);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(session({
  secret: 'FHA0HV0AVNA', // Change this to your secret key
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/invitation', invitationRouter);
app.use('/signout', signoutRouter);

// Landlord User Routes
app.use('/landlord-announcements', announcementLLRouter);
app.use('/landlord-feedback', feedbackLLRouter);
app.use('/landlord-view-feedback/', viewFeedbackLLRouter);
app.use('/landlord-properties', propertyRouter);
app.use('/landlord-tenant-list', tenantListRouter);

// Tenant User Routes
app.use('/tenant-announcements', announcementTenantRouter);
app.use('/tenant-feedback', feedbackTenantRouter);
app.use('/tenant-view-feedback/', viewFeedbackTenantRouter);
app.use('/new-feedback', newFeedbackTenantRouter);
// app.use("/submit-feedback", newFeedbackTenantRouter);

app.use('/dashboard', dashboardRouter);
app.use('/add_property', addPropertyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// TODO Maybe change to make a call to get properties and/or
// announcements before rendering the page

app.listen(port, () => {
  console.log(`Rent Ease web app listening at http://localhost:${port}`);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
