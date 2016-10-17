
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('datasets').del()
    .then(() => {
      return knex('datasets').insert([{
        id: 1,
        dataset_name: 'School Immunization Survey: Beginning 2012-13 School Year',
        domain: 'health.data.ny.gov',
        dataset_link: 'https://health.data.ny.gov/d/5pme-xbs5',
        dataset_description: 'The School Immunization Survey collects aggregate data from schools in New York State regarding the immunization status of all the students attending school.',
        dataset_key: '5pme-xbs5',
        created_at: new Date('2016-10-13 14:26:16 UTC'),
        updated_at: new Date('2016-10-13 14:26:16 UTC')
      }, {
        id: 2,
        dataset_name: 'Prevention Agenda Partner Contact Information',
        domain: 'health.data.ny.gov',
        dataset_link: 'https://health.data.ny.gov/d/fxaa-q2wy',
        dataset_description: 'This dataset contains the partners working on prevention agenda priority and focus areas. The dataset is organized by county, priority area and focus area.',
        dataset_key: 'fxaa-q2wy',
        created_at: new Date('2016-10-15 16:26:16 UTC'),
        updated_at: new Date('2016-10-15 16:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('datasets_id_seq', (SELECT MAX(id) FROM datasets));"
      );
    });
};
