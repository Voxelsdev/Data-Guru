'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    datasetId: joi.number()
      .required()
      .label('Dataset ID'),

    projectId: joi.number()
      .required()
      .label('Project ID')
  }
};
