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
        Materialize.toast('something went wrong...', 5000);
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
      if (projectInfo.length === 0) {
        const $row = $('<div class="row">');
        const $texts = $(`<p><h5>Oops! Seems like you don't have any datasets saved!</h5></p>`);
        const $button = $(`<button class="btn generalbutt searchdatasets col s3 offset-s4">Add new Datasets</button>`);

        $row.append($texts);
        $row.append($button);
        $('#sub-container').append($row);
        $button.on('click', () => {
          setview(1);
          $('select').material_select();
        });
      }

      for (let i = 0; i < projectInfo.length; i++) {
        const $li = $('<li></li>');
          const $header = $(`<div class="collapsible-header"><i class="material-icons">view_list</i>${projectInfo[i].datasetName}<p style="display: none;" class="hidden">${projectInfo[i].datasetsProjectsId}</p></div>`);
            const $del = $('<a class="btn-floating waves-effect waves-dark delete-dataset" title="Delete this dataset from the project"><i class="material-icons">new_releases</i></a>');
          const $body = $('<div class="collapsible-body">');
            const $checkBox = $(`<p class="p-checkbox"><input type="checkbox" class="filled-in custom-color" id="filled-in-box${i}" checked="checked"/><label for="filled-in-box${i}"></label></p>`);
            const $email = $('<p class="d-email-me">Email me this dataset</p>');
            const $desc = $(`<p class="d-description">${projectInfo[i].datasetDescription}</p>`);
            const $link = $(`<p class="d-link">${projectInfo[i].datasetLink}</p>`);

        $body.append($checkBox);
        $body.append($email);
        $body.append($desc);
        $body.append($link);
        $header.append($del);
        $li.append($header);
        $li.append($body);
        $mainUl.append($li);

        if (projectInfo.length) {
          const $hiddenName = $(`<p style="display: none;" id="hiddenName">${projectInfo[0].name}</p>`);
          const $hiddenId = $(`<p style="display: none;" id="hiddenId">${projectInfo[0].projectId}</p>`);
          $mainUl.append($hiddenName);
          $mainUl.append($hiddenId);
        }

        $del.on('click', (event) => {
          const id = parseInt($del.siblings('.hidden').text());
          const options = {
            contentType: 'application/json',
            type: 'DELETE',
            url: `projects/data/${id}`
          }

          $.ajax(options)
          .done(() => {
            setProjectView(projectInfo[0].projectId);
          })
          .fail(($xhr) => {
            Materialize.toast($xhr.responseText, 3000);
          });
        });
      }

      $('#project-id-container').text(projectId);
      $('#sub-container').append($mainUl);
      $('.collapsible').collapsible({
        accordion : true
      });
    })
    .fail(($xhr) => {
      Materialize.toast($xhr.responseText, 3000);
    });
  }

  function setProjecId(){
    $('#info-container').off('click');
    const id = parseInt($('#project-id-container').text());
    setProjectView(id);
  }

  function setMakeDataset() {
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
    $('#info-container').on('click', '.closerow', (event) => {
      if ($(event.target).hasClass('closerow')) {
        const projectId = parseInt($('#project-id-container').text());

        setProjectView(projectId);
        $('#info-container').off('click');
      }
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
    const domain = $('#domains option:selected').text().trim() || '';
    const tag = $('#tags option:selected').text().trim() || '';
    if (dataType !== 'Choose a Data Type' && category !== 'Choose a Category' && location && location !== '') {
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
        const $container = $('<div id="datadiv">')
        const $ulRow = $('<div class="row">');
        const $mainUl = $('<ul class="collapsible" data-collapsible="accordion" id="project-view">');
        if (datasets.length === 0) {
          return Materialize.toast('No Results!', 3000);
        }
        $('#sub-container').empty();

        datasets.forEach((elm) => {
          if (elm.datasetDescription === '') {
            elm.datasetDescription = 'No Description Available.';
          }
          const $li = $('<li></li>');
          const $header = $(`<div class="collapsible-header d-name"><i class="material-icons">view_list</i>${elm.datasetName}</div>`);
          const $body = $('<div class="collapsible-body">');
          const $desc = $(`<p class="d-description">${elm.datasetDescription}</p>`);
          const $link = $(`<p class="d-link">${elm.datasetLink}</p>`);
          const $buttRow = $('<div class="row">');
          const $addButt = $(`<button class="btn generalbutt addprobutt right">Add to Project</button>`);
          const $datasetId = $(`<div class="dataset-id">${elm.datasetKey}</div>`);
          const $domain = $(`<div class="dataset-domain">${elm.datasetDomain}</div>`)

          $buttRow.append($addButt);
          $body.append($desc);
          $body.append($link);
          $body.append($buttRow);
          $body.append($datasetId);
          $body.append($domain);
          $li.append($header);
          $li.append($body);
          $mainUl.append($li);
        });
        $('#sub-container').append($mainUl);
        $('.collapsible').collapsible();
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
    } else {
      Materialize.toast('Please fill in required information!', 3000);
    }
  }

  function addData(event) {
    const datasetName = $(event.target).parent().parent().siblings('.d-name').text().trim().substring(9);
    const datasetKey = $(event.target).parent().siblings('.dataset-id').text().trim();
    const datasetDescription = $(event.target).parent().siblings('.d-description').text().trim();
    const domain = $(event.target).parent().siblings('.dataset-domain').text().trim();
    const datasetLink = $(event.target).parent().siblings('.d-link').text().trim();
    const projectId = parseInt($('#project-id-container').text());
    const body = JSON.stringify({ datasetName, datasetKey, datasetDescription, domain, datasetLink });
    const options = {
      contentType: 'application/json',
      data: body,
      dataType: 'json',
      type: 'POST',
      url: `projects/${projectId}/datasets/add`
    };

    $.ajax(options)
    .done((data) => {
      if (data) {
        Materialize.toast('Data Added!', 3000);
        $(event.target).remove();
      } else {
        Materialize.toast('Oops! Something went wrong!', 3000);
      }
    })
    .fail(($xhr) => {
      Materialize.toast($xhr.responseText, 3000);
    });
  }

  function submitProjectChange(event, projId) {
    const eventName = $(event.target).val();
    const name = $('#edit-project-name').val().trim();
    const description = $('#edit-project-description').val().trim();

    if (!eventName || eventName === 'Cancel') {
      return setProjectView(projId);
    } else {
      if (!name && !description) {
        return Materialize.toast('Please enter a project name and description.', 2000);
      }

      if (!name || name.length > 30) {
        return Materialize.toast('Please enter a project name (must not exceed 30 characters).', 2000);
      }

      if (!description || description > 500) {
        return Materialize.toast('Please enter a project description (must not exceed 500 characters).', 2000);
      }
      const body = JSON.stringify({ name, description });
      const options = {
        contentType: 'application/json',
        data: body,
        dataType: 'json',
        type: 'PATCH',
        url: `projects/${projId}`
      };

      $.ajax(options)
      .done((data) => {
        if (data) {
          Materialize.toast('Project Changed Successfully!', 3000);
          makeProjectRequest();
          setProjectView(projId);
          $('#project-name-above').text(name);
          $('#project-desc-above').text(description);
        } else {
          Materialize.toast('Oops! Something went wrong!', 3000);
        }
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
    }
  }

  function editProjectWindow(event) {
    $('#sub-container').empty();
    const name = $(event.target).siblings('.projects').text() || $(event.target).parent().siblings('.projects').text();
    const desc = $(event.target).siblings('.project-description').text() || $(event.target).parent().siblings('.project-description').text();
    const id = parseInt($(event.target).siblings('.project-id').text()) || parseInt($(event.target).parent().siblings('.project-id').text());
    const $mainContainer = $('<div class="container", id="project-change-container">');
    const $mainRow = $('<div class="row">');
    const $form = $('<form class="project-change">');
    const $projNameInput = $(`<div class="row">
                                <div class="input-field col s12">
                                  <input id="edit-project-name" type="text" class="validate" value="${name}">
                                  <label class="active" for="edit-project-name">Project Name</label>
                                </div>
                              </div>`);
    const $projDescInput = $(`<div class="row">
                                <div class="input-field col s12">
                                  <textarea id="edit-project-description" class="materialize-textarea" length="500">${desc}</textarea>
                                  <label class="active" for="edit-project-description">Description</label>
                                </div>
                              </div>`);
    const $buttRow = $(`<div class="row">
                          <input class="col s3 btn offset-s2 generalbutt" type="button" value="Submit"/>
                          <input class="col s3 btn offset-s2 generalbutt" type="button" value="Cancel"/>
                      </div>`);

    $form.append($projNameInput);
    $form.append($projDescInput);
    $form.append($buttRow);
    $mainRow.append($form);
    $mainContainer.append($mainRow);
    $('#sub-container').append($mainContainer);

    $buttRow.on('click', (event) => {
      submitProjectChange(event, id);
    });
  }

  function addProjects(data) {
    $('#projects').empty();
    const projects = [];

    for(project of data) {
      const name = project.name;
      const projectId = project.id;
      const projectDescription = project.description;
      projects.push({ name, projectId, projectDescription });
    }

    for (project of projects) {
      const $container = $('<div class="grey-project-container">');
      const $name = $(`<a class="btn-large waves-effect waves-dark #8bc34a light-green projects">${project.name}</a>`);
      const $edit = $('<a class="btn-large waves-effect waves-dark #c3814b edit-project" title="Edit this project\'s name and description"><i class="material-icons prefix">mode_edit</i></a>');
      const $del = $('<a class="btn-large waves-effect waves-dark #c34b4b delete-project" title="Delete this project, warning this is permanent"><i class="material-icons prefix">report_problem</i></a>');
      const $projId = $(`<div class="project-id">${project.projectId}</div>`);
      const $projDesc = $(`<div class="project-description">${project.projectDescription}</div>`)

      $container.append($projId);
      $container.append($projDesc);
      $container.append($name);
      $container.append($edit);
      $container.append($del);
      $('#projects').append($container);

      $del.on('click', (event) => {
        const id = parseInt($(event.target).siblings('.project-id').text()) || parseInt($(event.target).parent().siblings('.project-id').text());
        $.ajax({
          contentType: 'application/json',
          type: 'DELETE',
          url: `projects/${id}`
        })
        .done(() => {
          Materialize.toast('Project deleted!', 2000);
          $('#sub-container').empty();
          makeProjectRequest();
        })
        .fail((err) => {
          Materialize.toast(err, 3000);
        });
      });

      $edit.on('click', editProjectWindow);
    }
  }

  function promptUser() {
    if ($('#prompt').children().length > 0) {
      return Materialize.toast('STAHP!', 3000);
    }

    $('#info-container').fadeOut(500, () => {
      const $promptContainer = $('<div id="prompt">');
        const $row1 = $('<div class="row">');
          const $name = $('<div class="input-field col s8 offset-s2"><i class="material-icons prefix">comment</i><input id="project_name" type="text" class="validate"><label for="project_name">Project Name</label></div>');
        const $row2 = $('<div class="row">');
          const $description = $('<div class="input-field col s8 offset-s2"><i class="material-icons prefix">comment</i><textarea id="project_desc" type="text" class="materialize-textarea"></textarea><label for="project_desc">Project Description</label></div>');
        const $row3 = $('<div class="row">');
            const $submit = $('<a class="waves-effect waves-light btn generalbutt col s2 offset-s3" id="save-project">Save</a>');
            const $cancel = $('<a class="waves-effect waves-light btn generalbutt col s2 offset-s3" id="cancel-project">Cancel</a>');

      $row1.append($name);
      $row2.append($description);
      $row3.append($submit);
      $row3.append($cancel);
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

        if (!name || name.length > 30) {
          return Materialize.toast('Please enter a project name (must not exceed 30 characters).', 2000);
        }

        if (!description || description > 500) {
          return Materialize.toast('Please enter a project description (must not exceed 500 characters).', 2000);
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

          const firstProjectOptions = {
            contentType: 'application/json',
            dataType: 'json',
            type: 'GET',
            url: 'projects'
          };

          $.ajax(firstProjectOptions)
          .done((projects) => {
            setProjectView(projects[projects.length].id);
          })
          .fail((err) => {
            Materialize.toast('Could not load in newest project', 2000);
          });
        })
        .fail(($xhr) => {
          Materialize.toast($xhr.responseText, 3000);
        });
        $('#make-project').on('click', () => {
          promptUser();
          $('#make-project').off();
        });
      });

      $cancel.on('click', () => {
        $('#prompt').remove();
        $('#info-container').fadeIn(500);
        $('#make-project').on('click', () => {
          promptUser();
          $('#make-project').off();
        });
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

  $('#make-project').on('click', () => {
    promptUser();
    $('#make-project').off();
  });
  $('section').on('click', '.projects', (event) => {
    const target = $(event.target);

    setview(0, parseInt(target.siblings().text()));
    $('#project-desc-above-p').text(target.siblings().eq(1).text());
    $('#project-name-above-p').text(target.text());
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
  $('section').on('click', '.addprobutt', addData);
})();
