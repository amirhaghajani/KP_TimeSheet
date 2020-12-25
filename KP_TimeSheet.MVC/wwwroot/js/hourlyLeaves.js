(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  $( ".fancytime1" ).timeDropper({
  // custom time format
//  format: 'h:mm a',
format: 'HH:mm',
  // auto changes hour-minute or minute-hour on mouseup/touchend.
  autoswitch: false,

  // sets time in 12-hour clock in which the 24 hours of the day are divided into two periods.
  meridians: false,

  // enable mouse wheel
  mousewheel: false,

  // auto set current time
  setCurrentTime: true,

  // fadeIn(default), dropDown
  init_animation: "fadein",

  // custom CSS styles
  primaryColor: "#1977CC",
  borderColor: "#1977CC",
  backgroundColor: "#FFF",
  textColor: '#555'

});
  $( ".fancytime2" ).timeDropper({
  // custom time format
//  format: 'h:mm a',
format: 'HH:mm',
  // auto changes hour-minute or minute-hour on mouseup/touchend.
  autoswitch: false,

  // sets time in 12-hour clock in which the 24 hours of the day are divided into two periods.
  meridians: false,

  // enable mouse wheel
  mousewheel: false,

  // auto set current time
  setCurrentTime: true,

  // fadeIn(default), dropDown
  init_animation: "fadein",

  // custom CSS styles
  primaryColor: "#1977CC",
  borderColor: "#1977CC",
  backgroundColor: "#FFF",
  textColor: '#555'

});
},{}]},{},[1]);
