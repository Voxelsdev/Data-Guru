'use strict';
exports.up = function(knex) {
  return knex.schema.table('datasets', (table) => {
    table.string('dataset_key', 9).notNullable().defaultTo('').index();
  });
};

exports.down = function(knex) {
  return knex.schema.table('datasets', (table) => {
    table.dropColumn('dataset_key');
  });
};
