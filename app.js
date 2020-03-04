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
var blockchainRouter = require('./routes/blockchain');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/users');
var patientRouter = require('./routes/patients');
var physicianRouter = require('./routes/physicians');
var labelsRouter = require('./routes/labels');
var appointmentRouter = require('./routes/appointment');
var messageRouter = require('./routes/message');
var settingRouter = require('./routes/setting');
var uploadRouter = require('./routes/upload');
var planRouter = require('./routes/plan');
var paymentRouter = require('./routes/payment');
var queingRouter = require('./routes/queing');
var drugsRouter = require('./routes/drugs');
var categoriesRouter = require('./routes/categories');
var supplierRouter = require('./routes/supplier');
var manufacturerRouter = require('./routes/manufacturer');

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
app.use('/api/blockchain', blockchainRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/patients', patientRouter);
app.use('/api/physicians', physicianRouter);
app.use('/api/labels', labelsRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/messages', messageRouter);
app.use('/api/setting', settingRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/plan', planRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/queing', queingRouter);
app.use('/api/drugs', drugsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/supplier', supplierRouter);
app.use('/api/manufacturer', manufacturerRouter);
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