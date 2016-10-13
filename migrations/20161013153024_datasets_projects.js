'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('datasets_projects', (table) => {
    table.increments();
    table.integer('dataset_id')
      .notNullable()
      .references('id')
      .inTable('datasets')
      .onDelete('CASCADE');
    table.integer('project_id')
      .notNullable()
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('datasets_projects');
};
