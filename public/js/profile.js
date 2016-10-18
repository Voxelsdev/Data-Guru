(() => {
  function setview(view, projectId) {
    switch (view) {
      case 0:
        // view project
        setProjectView(projectId);
        break;
      case 1:
        // make dataset
        setMakeDataset();
        break;
      default:
        console.log('something went wrong...');
    }
  }

  function setProjectView(projectId) {
    $('#sub-container').empty();
    const $mainUl = $('<ul class="collapsible" data-collapsible="accordion">');

    const options = {
      contentType: 'application/json',
      type: 'GET',
      url: `projects/${projectId}`
    }

    $.ajax(options)
    .done((projectInfo) => {
      for (let i = 0; i < projectInfo.length; i++) {
        const $li = $('<li>');
          const $header = $(`<div class="collapsible-header">${projectInfo[i].datasetName}`);
          const $body = $('<div class="collapsible-body">');
            const $checkBox = $(`<p class="p-checkbox"><input type="checkbox" class="filled-in custom-color" id="filled-in-box${i}" checked="checked"/><label for="filled-in-box${i}"></label></p>`)
            const $email = $('<p class="d-email-me">Email me this dataset</p>');
            const $desc = $(`<p class="d-description">${projectInfo[i].description}</p>`);
            const $link = $(`<p class="d-link">${projectInfo[i].datasetLink}</p>`);

        $body.append($link);
        $body.append($desc);
        $body.append($email);
        $body.append($checkBox);
        $li.append($body);
        $li.append($header);
        $mainUl.append($li);
      }
    })
    .fail(($xhr) => {
      Materialize.toast($xhr.responseText, 3000);
    });

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
    addProjects(data);
  })
  .fail(($xhr) => {
    Materialize.toast($xhr.responseText, 3000);
  });

  $('.collapsible').collapsible({
    accordion : true
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
    setview(0, parseInt(event.target.siblings().text()));
  });
})();
