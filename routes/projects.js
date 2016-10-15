'use strict';

const express = require('express');
const router = express.router();
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const ev = require('express-validation');
const validations = require('../validations/projects');
const { camelizeKeys, decamelizeKeys } = require('humps');

function authorize (req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.token = decoded;

    next();
  });
}

router.post('/projects', authroize, ev(validations.post), (req, res, next) => {

});

router.get('/projects', authorize, (req, res, next) => {

});

router.get('/projects/:id', authorize, (req, res, next) => {

});
