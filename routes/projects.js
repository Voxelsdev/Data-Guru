'use strict';

const express = require('express');
const router = express.router();
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const ev = require('express-validation');
const validations = require('../validations/projects');
const { camelizeKeys, decamelizeKeys } = require('humps');

function authorize (req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.token = decoded;

    next();
  });
}

// gets all of a users projects does not return datasets
router.get('/projects', authorize, (req, res, next) => {
  const userId = req.token;

  if (userId) {
    knex('projects')
    .where('projects.user_id', userId)
    .orderBy('projects.updated_at', 'DESC')
    .then((rows) => {
      res.send(camelizeKeys(rows))
    })
    .catch((err) => {
      next(err);
    });
  }
});

// gets a specific user's project returns information of datasets
router.get('/projects/:id', authorize, (req, res, next) => {
  const userId = req.token;

  if (userId) {
    const projectId = req.params.id;
    knex('projects')
    .select()
    .innerJoin('datasets_projects', 'datasets_projects.project_id', 'projects.id')
    .innerJoin('datasets', 'datasets.id', 'datasets_projects.dataset_id')
    .then((rows) => {
      const project = camelizeKeys(rows);

      res.send(project); // sends user's project and all the dataset info with it
    })
    .catch((err) => {
      next(err);
    });
  }
});

// posts a new project for the user, needs work
router.post('/projects', authorize, ev(validations.post), (req, res, next) => {
  const { projectId } = req.body;
  const { userId } = req.token;

  if (userId) {
    knex('projects')
    .where('id', projectId)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Project not found');
      }

      // return knex('projects').insert(decamelizeKeys({ userId,  }))
    })
  }
});
