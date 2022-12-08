const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

const compression = require('compression');
const helmet = require('helmet');

const app = express();


// Set up mongoose connection
const mongoose = require('mongoose');
const {frameguard} = require("helmet");
const dev_db_url = 'mongodb+srv://motorspotDev:motorspotDevPassword@motorspot.croipzn.mongodb.net/?retryWrites=true&w=majority';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => app.listen(3000))
    .catch(err => console.log(err));
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(helmet());
app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.

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

// contentSecurityPolicy
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'", '*.fontawesome.com', '*.youtube.com'],
            scriptSrc: ["'self'", '*.fontawesome.com', '*.youtube.com'],
            frameScr: ['*.youtube.com'],
            frameAncestors: ['*.youtube.com'],
        }
    },
    frameguard: {
        action: "deny",
    },
}));


module.exports = app;