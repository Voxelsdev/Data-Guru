'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const boom = require('boom');
const ev = require('express-validation');
const validations = require('../validations/projects');
const dataValidation = require('../validations/datasets');
const jwt = require('jsonwebtoken');
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
  const { userId } = req.token;

  knex('projects')
  .where('user_id', userId)
  .orderBy('id', 'ASC')
  .then((rows) => {
    res.send(camelizeKeys(rows));
  })
  .catch((err) => {
    next(err);
  });
});

// gets a specific user's project returns information of datasets
router.get('/projects/:id', authorize, (req, res, next) => {
  const { userId } = req.token;
  const projectId = req.params.id;

  knex('datasets_projects')
  .select('datasets_projects.id AS datasets_projects_id', '*')
  .innerJoin('datasets', 'datasets.id', 'datasets_projects.dataset_id')
  .innerJoin('projects', 'projects.id', 'datasets_projects.project_id')
  .where('projects.id', projectId)
  .where('projects.user_id', userId)
  .orderBy('datasets.id', 'ASC')
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
  const { name, description } = req.body;
  const { userId } = req.token;

  const project = { userId, name, description };

  knex('projects')
  .insert(decamelizeKeys(project), '*')
  .then((row) => {
    res.send(camelizeKeys(row[0]));
  })
  .catch((err) => {
    next(err);
  });
});

router.post('/projects/:id/datasets/add', authorize, ev(dataValidation.post), (req, res, next) => {
  const { datasetName, datasetKey, domain, datasetLink, datasetDescription } = req.body;
  const { userId } = req.token;
  const projectId = req.params.id;

  knex('datasets')
  .where('dataset_key', datasetKey)
  .first()
  .then((row) => {
    if (!row) {
      return knex.transaction((trx) => {
        const datasetInfo = { datasetName, datasetKey, domain, datasetLink, datasetDescription };

        return knex('datasets').insert(decamelizeKeys(datasetInfo), '*').transacting(trx)
          .then((row) => {
            const datasetRow = camelizeKeys(row[0]);
            const datasetProject = { projectId, datasetId: datasetRow.id };

            return knex('datasets_projects').insert(decamelizeKeys(datasetProject), '*').transacting(trx);
          })
          .then(trx.commit)
          .catch(trx.rollback);
      });
    } else {
      const datasetRow = camelizeKeys(row);
      const datasetProject = { projectId, datasetId: datasetRow.id };

      return knex('datasets_projects').insert(decamelizeKeys(datasetProject), '*');
    }
  })
  .then((row) => {
    res.send(camelizeKeys(row));
  })
  .catch((err) => {
    next(err);
  });


});

router.patch('/projects/:id', authorize, ev(validations.patch), (req, res, next) => {
  knex('projects')
    .where('id', req.params.id)
    .where('user_id', req.token.userId)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found')
      }

      const { name, description } = req.body;
      const updateProject = { name, description };

      return knex('projects')
        .where('id', req.params.id)
        .update(decamelizeKeys(updateProject), '*');
    })
    .then((row) => {
      const project = camelizeKeys(row[0]);

      res.send(project);
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

router.delete('/projects/data/:id', authorize, (req, res, next) => {
  const { userId } = req.token;
  let dataset_project;

  knex('datasets_projects')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found')
      }

      dataset_project = camelizeKeys(row);

      return knex('datasets_projects')
        .where('id', req.params.id)
        .del();
    })
    .then(() => {
      delete dataset_project.id;

      res.send(dataset_project);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
