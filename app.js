var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var helmet = require('helmet');
var cors = require('cors');

/**
 * Routes
 */
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/users');
var ownerRouter = require('./routes/owners');
var customerRouter = require('./routes/customers');
var techniciansRouter = require('./routes/technicians');
var repairsRouter = require('./routes/repairs');
var labelsRouter = require('./routes/labels');
var settingRouter = require('./routes/setting');
var uploadRouter = require('./routes/upload');

var app = express();

/**
 * CORS
 */
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// remove default powered by on header
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json({ limit: '50MB' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50MB' }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(path.join(__dirname, 'files')));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/owners', ownerRouter);
app.use('/api/customers', customerRouter);
app.use('/api/technicians', techniciansRouter);
app.use('/api/repairs', repairsRouter);
app.use('/api/labels', labelsRouter);
app.use('/api/setting', settingRouter);
app.use('/api/upload', uploadRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
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