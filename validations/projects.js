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
  },

  params: {
    id: joi.number()
      .integer()
      .required()
      .min(0)
      .label('Id')
  }
};

module.exports.delete = {
  params: {
    id: joi.number()
      .integer()
      .required()
      .min(0)
      .label('Id')
  }
};

module.exports.deleteWithQuery = {
  params: {
    id: joi.number()
      .integer()
      .required()
      .min(0)
      .label('Project Id')
  },

  query: {
    id: joi.number()
      .integer()
      .required()
      .min(0)
      .label('Dataset Id')
  }
};
