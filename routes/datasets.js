'use strict';

const express = require('express');
const router = express.Router();
const boom = require('boom');
const jwt = require('jsonwebtoken');
const request = require('../modules/reqjson');
const getJSON = request.getJSON;

function authorize(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    next();
  });
}

router.post('/datasets', authorize, (req, res, next) => {
  const { dataType, category, location, domain, tag } = req.body;
  const domains = 'domains=' + domain;
  const categories = 'categories=' + category;
  const only = 'only=' + dataType;
  const q = 'q=' + location + ' ' + tag;
  const url = `http://api.us.socrata.com/api/catalog/v1?${domains}&${categories}&${only}&${q}&limit=20`;
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
