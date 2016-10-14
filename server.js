'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const users = require('./routes/users');
const projects = require('./routes/projects');
const port = process.env.PORT || 8000;

app.disable('x-powered-by');
app.use(express.static(path.join('public')));

switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;

  case 'production':
    app.use(morgan('short'));
    break;

  default:
}

app.use(users);
app.use(projects);
app.use(bodyParser.json());
app.use(cookieParser());

app.use((_req, res) => {
  res.sendStatus(404);
});

app.use((req, res, next) => {
  if (/json/.test(req.get('Accept'))) {
    return next();
  }

  res.sendStatus(406);
});

// eslint-disable-next-line max-params
app.use((err, _req, res, _next) => {
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  // eslint-disable-next-line no-console
  console.error(JSON.stringify(err, null, 2));

  if (err.status) {
    return res
    .status(err.status)
    .set('Content-Type', 'text/plain')
    .send(err.statusText)

  }
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => {
  if (app.get('env') !== 'test') {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
  }
});

module.exports = app;
