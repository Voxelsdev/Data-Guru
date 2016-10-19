(() => {
  function setview(view, projectId) {
    switch (view) {
      case 0:
        // view project
        setProjectView(projectId);
        break;
      case 1:
        // make dataset
        setMakeDataset(projectId);
        break;
      default:
        console.log('something went wrong...');
    }
  }

  function setProjectView(projectId) {
    $('#sub-container').empty();
    const $mainUl = $('<ul class="collapsible" data-collapsible="accordion" id="project-view">');

    const options = {
      contentType: 'application/json',
      type: 'GET',
      url: `projects/${projectId}`
    }

    $.ajax(options)
    .done((projectInfo) => {
      for (let i = 0; i < projectInfo.length; i++) {
        const $li = $('<li></li>');
          const $header = $(`<div class="collapsible-header"><i class="material-icons">view_list</i>${projectInfo[i].datasetName}</div>`);
          const $body = $('<div class="collapsible-body">');
            const $checkBox = $(`<p class="p-checkbox"><input type="checkbox" class="filled-in custom-color" id="filled-in-box${i}" checked="checked"/><label for="filled-in-box${i}"></label></p>`)
            const $email = $('<p class="d-email-me">Email me this dataset</p>');
            const $desc = $(`<p class="d-description">${projectInfo[i].datasetDescription}</p>`);
            const $link = $(`<p class="d-link">${projectInfo[i].datasetLink}</p>`);

        $body.append($checkBox);
        $body.append($email);
        $body.append($desc);
        $body.append($link);
        $li.append($header);
        $li.append($body);
        $mainUl.append($li);
      }

      if (projectInfo.length) {
        const $hiddenName = $(`<p style="display: none;" id="hiddenName">${projectInfo[0].name}</p>`);
        const $hiddenId = $(`<p style="display: none;" id="hiddenId">${projectInfo[0].projectId}</p>`);
        $mainUl.append($hiddenName);
        $mainUl.append($hiddenId);
      }
      $('#sub-container').append($mainUl);

      const $deleteUl = $('<ul class="collapsible" data-collapsible="accordion">');
        const $deleteLi = $('<li>');
          const $deleteHeader = $('<div class="collapsible-header" id="delete-collapse-header"><i class="material-icons">new_releases</i>Delete Project</div>');
          const $deleteBody = $('<div class="collapsible-body" id="delete-collapse-body">');
            const $checkRow = $('<div class="row">');
              const $check = $('<div class="input-field col s12"><input id="check-delete" type="text" class="validate"><label for="check-delete">Enter Project Name</label></div>');
            const $confirmRow = $('<div class="row">');
              const $confirmCol = $('<div class="col s4 offset-s8">');
                const $confirm = $('<a class="waves-effect waves-light btn" id="delete-project">Delete Project</a>');

      $confirmCol.append($confirm);
      $confirmRow.append($confirmCol);
      $checkRow.append($check);
      $deleteBody.append($checkRow);
      $deleteBody.append($confirmRow);
      $deleteLi.append($deleteHeader);
      $deleteLi.append($deleteBody);
      $deleteUl.append($deleteLi);
      $('#sub-container').append($deleteUl);

      $('.collapsible').collapsible({
        accordion : true
      });

      $confirm.on('click', () => {
        if (projectInfo.length) {
          if ($('#check-delete').val() === $('#hiddenName').text()) {
            const options = {
              contentType: 'application/json',
              type: 'DELETE',
              url: `projects/${parseInt($('#hiddenId').text())}`
            }
            $.ajax(options)
            .done(() => {
              makeProjectRequest();
              Materialize.toast('Project Deleted!', 2000);
            })
            .fail(($xhr) => {
              Materialize.toast($xhr.responseText, 3000);
            });
          } else {
            Materialize.toast('Whoops, wrong project!', 2000);
          }
        } else {
          Materialize.toast('Sorry, but you must have at least one dataset to delete a project.', 4000);
        }
      });
    })
    .fail(($xhr) => {
      Materialize.toast($xhr.responseText, 3000);
    });

  }

  function setMakeDataset(projectId) {
    $('#sub-container').empty();

    const labels = ['I want', 'In the Category of', 'In the Location', 'In the Domain of', 'With a tag'];
    const dataTypes = ['','datasets', 'filters', 'charts', 'maps',
                      'datalenses', 'stories', 'files', 'hrefs'];
    const categories = ['','finance', 'public safety', 'infrastructure',
                        'environment', 'demographics', 'economy', 'transportation',
                        'education', 'health', 'housing and development', 'social services',
                        'politics', 'recreation'];
    const $selectordiv = $('<div class="container" id="selectordiv">');
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
        $categorySelect.append(`<option value="" disabled selected>Choose a Category</option>`);
      } else {
        $categorySelect.append(`<option value="${categories[i]}">${categories[i]}</option>`);
      }
    }

    for (let i = 0; i < labels.length; i++) {
      const $rowDiv = $('<div class="row">');
      const $colDiv = $('<div class="col s5">');

      $rowDiv.append(`<p class="col s5">${labels[i]}</p>`);
      if (i === 0) {
        $colDiv.append($dataSelect);
      } else if (i === 1) {
        $colDiv.append($categorySelect);
      } else if (i === 2) {
        $colDiv.append(`<input placeholder="Enter a Location" id="location" type="text" class="location">`);
      } else if (i === 3) {
        $colDiv.append('<select id="domains" disabled>');
      } else {
        $colDiv.append('<select id="tags" disabled>');
      }
      $rowDiv.append($colDiv);
      $selectordiv.append($rowDiv);
    }

    $('#sub-container').append($selectordiv);
    $('#info-container').on('click', (projectId) => {
      setProjectView(projectId);
    });
  }

  function checkInfo() {
    const dataType = $('#dataType option:selected').text();
    const category = $('#category option:selected').text();
    const location = $('#location').val();

    $('#domains').empty();
    $('#tags').empty();

    if (dataType !== 'Choose a Data Type' && category !== 'Choose a Category' && location && location !== '') {
      const categories = 'categories=' + category;
      const only = 'only=' + dataType;
      const q = 'q=' + location;
      const url = `http://api.us.socrata.com/api/catalog/v1?${categories}&${only}&${q}`;
      $.getJSON(url)
      .done((data) => {
        const domains = [];
        const tags = [];

        data.results.forEach((elm) => {
          const metadata = elm.metadata;
          const dTags = elm.classification.domain_tags;
          if (domains.indexOf(metadata.domain) < 0) {
            domains.push(metadata.domain);
          }
          dTags.forEach((element) => {
            if (tags.indexOf(element) < 0) {
              tags.push(element);
            }
          });
        });

        $('#domains').prop('disabled', false);
        $('#tags').prop('disabled', false);

        domains.forEach((elm) => {
          $('#domains').append(`<option value="${elm}">${elm}</option>`);
        });

        tags.forEach((elm) => {
          $('#tags').append(`<option value="${elm}">${elm}</option>`)
        });

        if (!$('#submitbutt')[0]) {
          const $newRow = $('<div class="row">');
          const $newCol = $('<div class="col s12">');
          const $submitButt = $(`<button class="btn generalbutt" type="submit" id="submitbutt">Submit</button>`);

          $newCol.append($submitButt);
          $newRow.append($newCol);
          $('#selectordiv').append($newRow);
        }
        $('select').material_select();
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
    }
  }

  function dataFind() {
    const dataType = $('#dataType option:selected').text().trim();
    const category = $('#category option:selected').text().trim();
    const location = $('#location').val().trim();
    const domain = $('#domains option:selected').text().trim();
    const tag = $('#tags option:selected').text().trim();
    if (dataType !== 'Choose a Data Type' && category !== 'Choose a Category' && location && location !== '' && domain !== '' && tag !== '') {
      $('#sub-container').empty();
      const body = JSON.stringify({ dataType, category, location, domain, tag });
      const options = {
        contentType: 'application/json',
        data: body,
        dataType: 'json',
        type: 'POST',
        url: '/datasets'
      };

      $.ajax(options)
      .done((datasets) => {
        console.log(datasets);
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      })
    } else {
      Materialize.toast('Please fill in required information!', 3000);
    }

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
    setview(0, parseInt($(event.target).siblings().text()));
  });
  $('section').on('click', '#datasetSearch', () => {
    if ($('#project-view').length) {
      setview(1);
      $('select').material_select();
    } else {
      Materialize.toast('Please select a project to add the dataset to.', 3000);
    }
  });
  $('section').on('change', '.choice', checkInfo);
  $('section').on('blur', '.location', checkInfo);
  $('section').on('click', '#submitbutt', dataFind);
})();
