// eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const router = express.router();
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const ev = require('express-validation');
const validations = require('../validations/users');
const { camelizeKeys, decamelizeKeys } = require('humps');

router.post('/users', (req, res, next) => {
  const { email, password } = req.body;

  knex('users')
  .where('email', email)
  .then((user) => {
    if (user.length) {
      return next(boom.create(400, 'Email already exists'));
    }

    bcrypt.hash(password, 13)
    .then((hashedPassword) => {
      const insertUser = { email, hashedPassword };

      return knex('users').insert(decamelizeKeys(insertUser), '*');
    })
    .then((rows) => {
      const user = camelizeKeys(rows[0]);

      delete user.hashedPassword;

      res.send(user);
    })
    .catch((err) => {

    });
  })
  .catch((err) => {
    next(err);
  });
});
