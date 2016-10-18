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
    $('#projects').empty();
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


  function promptUser() {
    $('#info-container').fadeOut(500, () => {
      const $promptContainer = $('<div id="prompt">');
        const $row1 = $('<div class="row">');
          const $name = $('<div class="input-field col s12"><i class="material-icons prefix">comment</i><input id="project_name" type="text" class="validate"><label for="project_name">Project Name</label></div>');
        const $row2 = $('<div class="row">');
          const $description = $('<div class="input-field col s12"><i class="material-icons prefix">comment</i><input id="project_desc" type="text" class="validate"><label for="project_desc">Project Description</label></div>');
        const $row3 = $('<div class="row">');
          const $col1 = $('<div class="col s6">');
            const $submit = $('<a class="waves-effect waves-light btn" id="save-project">Save</a>');
          const $col2 = $('<div class="col s6">');
            const $cancel = $('<a class="waves-effect waves-light btn" id="cancel-project">Cancel</a>');

      $row1.append($name);
      $row2.append($description);
      $row3.append($col2);
      $row3.append($col1);
      $col1.append($submit);
      $col2.append($cancel);
      $promptContainer.append($row1);
      $promptContainer.append($row2);
      $promptContainer.append($row3);
      $('#project-list').after($promptContainer);

      $submit.on('click', () => {
        const name = $('#project_name').val();
        const description = $('#project_desc').val();

        if (!name && !description) {
          return Materialize.toast('Please enter a project name and description.', 2000);
        }

        if (!name) {
          return Materialize.toast('Please enter a project name.', 2000);
        }

        if (!description) {
          return Materialize.toast('Please enter a project description.', 2000);
        }

        const body = JSON.stringify({ name, description });
        const options = {
          contentType: 'application/json',
          data: body,
          dataType: 'json',
          type: 'POST',
          url: 'projects'
        }

        $.ajax(options)
        .done(() => {
          $('#prompt').remove();
          makeProjectRequest();
          Materialize.toast('Project created!', 2000);
          $('#info-container').fadeIn(500);
        })
        .fail(($xhr) => {
          Materialize.toast($xhr.responseText, 3000);
        });
      });

      $cancel.on('click', () => {
        $('#prompt').remove();
        $('#info-container').fadeIn(500);
      });
    });
  }

  function makeProjectRequest() {
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
  }
  makeProjectRequest();

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

  // needs to post a blank project
  $('#make-project').on('click', () => {
    promptUser();
  });

  $('section').on('click', '.projects', (event) => {
    console.log($(event.target).siblings().text());
    setview(0, parseInt($(event.target).siblings().text()));
  });
  $('section').on('change', '.choice', checkInfo);
  $('section').on('blur', '.location', checkInfo);

  $('select').material_select();
})();
