(() => {
  function setview(view) {
    switch (view) {
      case 0:
        // view project
        setProjectView();
        break;
      case 1:
        // view dataset
        setDatasetView();
        break;
      case 2:
        // make dataset
        setMakeDataset();
        break;
      default:
        console.log('something went wrong...');
    }
  }

  function setProjectView() {
    const $mainContain = $('<div class="row">');
    const $subContain = $('<div class="col s8 offset-s2" id="sub-container">');


    $('#info-container').empty();
  }

  function setDatasetView() {

  }

  function setMakeDataset() {

  }

  function addProjects(data) {
    const projects = [];

    for(project of data) {
      const name = project.name;
      const projectId = project.id;
      projects.push({ name, projectId });
    }

    for (project of projects) {
      const $container = $('<div class="grey-project-container">');
      const $button = $(`<a class="btn-large waves-effect waves-dark #8bc34a light-green projects">${project.name}</a>`);
      const $projId = $(`<div class="project-id">${project.projectId}</div>`);

      $container.append($projId);
      $container.append($button);
      $('#projects').append($container);
    }
  }

  $.ajax({
    contentType: 'application/json',
    type: 'GET',
    url: 'projects'
  })
  .done((data) => {
    addProjects(JSON.parse(data));
  })
  .fail(($xhr) => {
    Materialize.toast($xhr.responseText, 3000);
  });

  $('#logout').on('click', () => {
    const options = {
      contentType: 'application/json',
      type: 'DELETE',
      url: '/tokens'
    };

    $.ajax(options)
    .done(() => {
      window.location.href = './index.html';
    })
    .fail(($xhr) => {
      Materialize.toast($xhr.responseText, 3000);
    });
  });

  $('#make-project').on('click', () => {
    console.log('lmao u thought u were gettin a project');
  });

  $('.projects').on('click', (event) => {
    setview(0);
  });
})();
