'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('datasets', (table) => {
    table.increments();
    table.string('dataset_name').notNullable().defaultTo('');
    table.string('domain').notNullable().defaultTo('');
    table.string('dataset_link').notNullable().defaultTo('');
    table.string('dataset_description').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('datasets');
};
