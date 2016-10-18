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
      console.log(projectInfo);
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
      $('#sub-container').append($mainUl);
    })
    .fail(($xhr) => {
      Materialize.toast($xhr.responseText, 3000);
    });

  }

  function setMakeDataset() {
    $('#sub-container').empty();
    if (!$('#sub-container').hasClass('valign-wrapper')) {
      $('#sub-container').toggleClass('valign-wrapper');
    }
    const labels = ['I want', 'In the Category of', 'In the Location'];
    const dataTypes = ['','datasets', 'filters', 'charts', 'maps',
                      'datalenses', 'stories', 'files', 'hrefs'];
    const categories = ['','finance', 'public safety', 'infrastructure',
                        'environment', 'demographics', 'economy', 'transportation',
                        'education', 'health', 'housing and development', 'social services',
                        'politics', 'recreation'];
    const $selectordiv = $('<div class="container valign selectordiv">');
    const $dataSelect = $('<select class="choice" id="dataType">');
    const $categorySelect = $('<select class="choice" id="category">');

    for (let i = 0; i < dataTypes.length; i++) {
      if (i === 0) {
        $dataSelect.append(`<option value="" disabled selected>Choose a Data Type</option>`);
      } else {
        $dataSelect.append(`<option value="${dataTypes[i]}">${dataTypes[i]}</option>`);
      }
    }

    for (let i = 0; i < categories.length; i++) {
      if (i === 0) {
        $categorySelect.append(`<option value="" disabled selected>Choose a Data Type</option>`);
      } else {
        $categorySelect.append(`<option value="${categories[i]}">${categories[i]}</option>`);
      }
    }

    for (let i = 0; i < labels.length; i++) {
      const $rowDiv = $('<div class="row">')
      const $colDiv = $('<div class="col s4">');

      $rowDiv.append(`<p class="col s5">${labels[i]}</p>`);
      if (i === 0) {
        $colDiv.append($dataSelect);
      } else if (i === 1) {
        $colDiv.append($categorySelect);
      } else {
        $colDiv.append(`<input placeholder="Enter a Location" id="location" type="text" class="location">`);
      }
      $rowDiv.append($colDiv);
      $selectordiv.append($rowDiv);
    }

    $('#sub-container').append($selectordiv);
  }

function checkInfo() {
  const dataType = $('#dataType option:selected').text();
  const category = $('#category option:selected').text();
  const location = $('#location').val();
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
    url: '/projects'
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
      url: '/token'
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

  $('section').on('click', '.projects', (event) => {
    console.log($(event.target).siblings().text());
    setview(0, parseInt($(event.target).siblings().text()));
  });
  $('section').on('change', '.choice', checkInfo);
  $('section').on('blur', '.location', checkInfo);

  $('select').material_select();
})();
