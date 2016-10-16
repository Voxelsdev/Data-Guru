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

  knex('projects')
  .where('projects.user_id', userId)
  .orderBy('projects.updated_at', 'DESC')
  .then((rows) => {
    res.send(camelizeKeys(rows))
  })
  .catch((err) => {
    next(err);
  });
});

// gets a specific user's project returns information of datasets
router.get('/projects/:id', authorize, (req, res, next) => {
  const userId = req.token;
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
});

// posts a new project for the user
router.post('/projects', authorize, ev(validations.post), (req, res, next) => {
  const { project } = req.body;
  const { userId } = req.token;

  knex('projects')
  .insert(decamelizeKeys(project), '*')
  .then((row) => {
    res.send(camelizeKeys(row));
  })
  .catch((err) => {
    next(err);
  });
});

router.post('/projects/:id/datasets/add', authorize, ev(validations.post), (req, res, next) => {
  const { datasetName, datasetKey, domain, datasetLink, datasetDescription } = req.body;
  const { userId } = req.token;
  const projectId = req.params.id;

  knex('datasets')
  .where('dataset_key', datasetKey)
  .first()
  .then((row) => {
    if (!row) {
      const datasetInfo = { datasetName, datasetKey, domain, datasetLink, datasetDescription };

      knex('datasets').insert(decamelizeKeys(datasetInfo), '*')
        .then((row) => {
          const datasetRow = camelizeKeys(row);
          const datasetProject = { projectId, datasetId: datasetRow.id };

          return knex('datasets_projects').insert(decamelizeKeys(datasetProject), '*')
        })
        .then((row) => {
          res.send(camelizeKeys(row));
        })
        .catch((err) => {
          next(err);
        })
    } else {
      const datasetRow = camelizeKeys(row);
      const datasetProject = { projectId, datasetId: datasetRow.id };

      knex('datasets_projects').insert(decamelizeKeys(datasetProject), '*')
        .then((row) => {
          res.send(camelizeKeys(row));
        })
        .catch((err) => {
          next(err);
        });
    }
  })
  .catch((err) => {
    next(err);
  });
});

router.delete('/projects/:id', authorize, ev(validations.delete), (req, res, next) => {
  const { userId } = req.token;
  let project;

  knex('projects')
    .where('id', req.params.id)
    .where('user_id', userId)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found');
      }

      project = camelizeKeys(row);

      return knex('projects')
        .where('id', req.params.id)
        .del();
    })
    .then(() => {
      delete project.id;

      res.send(project);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/projects/:id/data', authorize, ev(validatins.delete), (req, res, next) => {
  const { userId } = req.token;

});
