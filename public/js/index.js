'use strict';
(() => {
  $('.parallax-window').parallax({imageSrc: './images/landing.png'});

  $('#nav-button1').on('click', () => {
    localStorage.access = 'login';
  });
  $('#nav-button2').on('click', () => {
    localStorage.access = 'signup';
  });
})();
