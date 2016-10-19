
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('datasets_projects').del()
    .then(() => {
      return knex('datasets_projects').insert([{
        id: 1,
        dataset_id: 1,
        project_id: 1,
        created_at: new Date('2016-10-13 14:26:16 UTC'),
        updated_at: new Date('2016-10-13 14:26:16 UTC')
      }, {
        id: 2,
        dataset_id: 2,
        project_id: 1,
        created_at: new Date('2016-10-15 16:26:16 UTC'),
        updated_at: new Date('2016-10-15 16:26:16 UTC')
      }, {
        id: 3,
        dataset_id: 2,
        project_id: 2,
        created_at: new Date('2016-10-16 15:09:23 UTC'),
        updated_at: new Date('2016-10-16 15:09:23 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('datasets_projects_id_seq', (SELECT MAX(id) FROM datasets_projects));"
      );
    });
};
