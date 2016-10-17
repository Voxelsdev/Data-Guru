
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('projects').del()
  .then(() => {
    return knex('projects').insert([{
      id: 1,
      user_id: 1,
      name: 'Alpha',
      description: 'This is secret project Alpha',
      created_at: new Date('2016-10-13 14:26:16 UTC'),
      updated_at: new Date('2016-10-13 14:26:16 UTC')
    }, {
      id: 2,
      user_id: 1,
      name: 'Bravo',
      description: 'Chivalry is dead',
      created_at: new Date('2016-10-14 15:25:18 UTC'),
      updated_at: new Date('2016-10-14 15:25:18 UTC')
    }, {
      id: 3,
      user_id: 2,
      name: 'Philip J Fry',
      description: 'Robots rule!',
      created_at: new Date('2016-10-16 13:08:18 UTC'),
      updated_at: new Date('2016-10-16 13:08:18 UTC')
    }]);
  })
  .then(() => {
    return knex.raw(
      "SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));"
    );
  });
};
