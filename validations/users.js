'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    email: joi.string()
      .email()
      .trim()
      .max(50)
      .min(6)
      .label('Email')
      .required(),

    password: joi.string()
      .min(10)
      .label('Password')
      .required()
  }
};
