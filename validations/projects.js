'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    name: joi.string()
      .label('Name')
      .max(30)
      .required(),

    description: joi.string()
      .label('Description')
      .max(500)
      .required()
  }
};

module.exports.patch = {
  body: {
    name: joi.string()
      .label('Name')
      .max(30),

    description: joi.string()
      .label('Description')
      .max(500)
  }
};

module.exports.delete = {
  params: {
    id: Joi.number()
      .integer()
      .required()
      .min(0)
      .label('Id');
  }
};
