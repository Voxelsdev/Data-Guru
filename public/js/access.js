(() => {
  'use strict';

  $.get('http://quotes.rest/qod.json', (response) => {
    $('#author').text('-    ' + response.contents.quotes[0].author);
    $('#quote').text(response.contents.quotes[0].quote);
  });

  $('#accessType').text(localStorage.access.toUpperCase());

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

    if (password.length < 10) {
      return Materialize.toast('Password must be at least 10 characers', 2000);
    }

    if (localStorage.access === 'login') {
      var url = '/token';
    } else if (localStorage.access === 'signup') {
      var url = 'users';
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
      if (localStorage.access === 'login') {
        window.location.href = '/profile.html';
      } else if (localStorage.access === 'signup') {
        const signinOptions = {
          contentType: 'application/json',
          data: JSON.stringify({ email, password }),
          dataType: 'json',
          type: 'POST',
          url: '/token'
        }

        $.ajax(signinOptions)
        .done(() => {
          window.location.href = '/profile.html';
        })
        .fail(() => {
          Materialize.toast('Your account was created, but we could not log you in automatically', 4000);
        });
      }
    })
    .fail(($xhr) => {
      Materialize.toast($xhr.responseText, 3000);
    });
  }

  $('#login').on('submit', login);
  $('.submit').on('click', login);
})();
