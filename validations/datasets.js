'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    datasetName: joi.string()
      .required()
      .max(50)
      .label('Dataset Name'),

    domain: joi.string()
      .required()
      .label('Domain'),

    datasetLink: joi.string()
      .required()
      .label('Dataset URL'),

    datasetDescription: joi.string()
      .max(100)
      .label('Dataset Description')
  }
};

module.exports.patch = {
  body: {
    datasetName: joi.string()
      .max(30)
      .label('Dataset Name'),

    domain: joi.string()
      .label('Domain'),

    datasetLink: joi.string()
      .label('Dataset URL'),

    datasetDescription: joi.string()
      .max(100)
      .label('Dataset Description')
  }
};
