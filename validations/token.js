'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    email: joi.string()
      .label('Email')
      .required()
      .min(7)
      .max(50)
      .trim(),
      
    password: joi.string()
      .label('Password')
      .required()
      .min(8)
  }
};
