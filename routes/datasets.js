'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const boom = require('boom');
const ev = require('express-validation');
const jwt = require('jsonwebtoken');
const request = require('../modules/reqjson');
const getJSON = request.getJSON;
const { camelizeKeys, decamelizeKeys } = require('humps');

function authorize (req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    next();
  });
}

router.get('/datasets', (req, res, next) => {
  const { url } = req.body;
  const option = {
    uri: url,
    headers: {
      'X-App-Token': 'zNfDL0xiEqLfIGY93LRvszBI6'
    }
  };
  getJSON(option)
    .then((data) => {
      const reponseBody = data.results.map((elm) => {
        const resource = elm.resource;
        const description = resource.description;
        const metadata = elm.metadata;
        return {
          datasetName: resource.name,
          datasetDomain: metadata.domain,
          datasetLink: elm.permalink,
          datasetDescription: description.substring(0, description.indexOf('.') + 1),
          datasetKey: resource.id
        };
      });
      res.send(reponseBody);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
