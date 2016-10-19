'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    datasetName: joi.string()
      .required()
      .max(100)
      .label('Dataset Name'),

    domain: joi.string()
      .required()
      .label('Domain'),

    datasetLink: joi.string()
      .required()
      .label('Dataset URL'),

    datasetDescription: joi.string()
      .required()
      .max(255)
      .label('Dataset Description')
  }
};
