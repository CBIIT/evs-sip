const express = require('express');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const logger = require('morgan');
const config = require('./index');


// const indexRouter = require('./routes/index')

module.exports = function(app) {
  // if (config.env !== 'prod') { 
  //   app.use(logger('dev')) 
  // };
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.resolve(config.root, 'build')));

  app.use(compression());
  
  app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

		if (next) {
			next();
		}
	});

  //Routers
  //app.use('/api', indexRouter)
  app.use('/api/search', require('../service/search'));

  app.get('*', (req, res) => {
    res.sendFile('build/index.html', { root: config.root });
  });

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError(404));
  });

  // TODO: Add your own error handler here.
  if (config.env === 'prod') {
    // Do not send stack trace of error message when in production
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.send('Error occurred while handling the request.');
    });
  } else {
    app.use(logger('dev'));
    // Log stack trace of error message while in development
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      console.log(err);
      res.send(err.message);
    });
  }
}
