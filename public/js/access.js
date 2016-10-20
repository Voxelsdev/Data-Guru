(() => {
  'use strict';

  $.get('http://quotes.rest/qod.json', (response) => {
    $('#author').text('-    ' + response.contents.quotes[0].author);
    $('#quote').text(response.contents.quotes[0].quote);
  });

  function login(event) {
    event.preventDefault();
    const email = $('#account_circle').val();
    const password = $('#verified_user').val();

    if (!email) {
      return Materialize.toast('Email must not be blank', 2000);
    }

    if (email.indexOf('@') < 0) {
      return Materialize.toast('Email must be valid', 3000);
    }

    if (!password) {
      return Materialize.toast('Password must not be blank', 2000);
    }

    if (password.length < 8) {
      return Materialize.toast('Password must be at least 8 characers', 2000);
    }

    if (localStorage.access === 'login') {
      var url = '/token';
    } else if (localStorage.access === 'signup') {
      var url = '/users';
    }

    const options = {
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      dataType: 'json',
      type: 'POST',
      url: url
    };

    $.ajax(options)
    .done(() => {
      window.location.href = '/profile.html';
    })
    .fail(($xhr) => {
      Materialize.toast($xhr.responseText, 3000);
    });
  }

  $('#login').on('submit', login);
  $('.submit').on('click', login);
})();
