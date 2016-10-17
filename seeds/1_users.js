
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      return knex('users').insert([{
        id: 1,
        email: 'jk@g.com',
        hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS',  // youreawizard
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 2,
        email: 'fry@mail.com',
        hashed_password: '$2a$12$NvBegF/T4LlhaD1gpZFzf.X2RbJN/S/yYl8S40d7SadS7KyEcg32.', //benderrules
        created_at: new Date('2016-08-28 08:28:28 UTC'),
        updated_at: new Date('2016-08-28 08:28:28 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    });
};
