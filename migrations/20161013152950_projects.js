'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('projects', (table) => {
    table.increments();
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('name', 30).notNullable().defaultTo('');
    table.string('description', 500).notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('projects');
};
