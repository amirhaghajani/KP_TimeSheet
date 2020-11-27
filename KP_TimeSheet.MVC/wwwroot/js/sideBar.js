(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

function init(){
  $('#onclickOpenName').on('click',openNav);
}

init();


function openNav() {

  if ($("#mySidebar").css('marginRight') == "-250px") {
    $(".panel-collapse").collapse("hide");
    $(".ras-sidebar-left-logo").fadeOut(100);
    $("#mySidebar").css({ "margin-right": "0px" });
    var width = $(window).width();
    $(".content-body").css({ "margin-right": "300px" });
    $('.content-body').css({ 'width': width - 300 + "px" });

  } else {
    $(".ras-sidebar-left-logo").fadeIn(100);
    $('.panel-collapse').collapse('hide');
    var width = $(window).width();
    $("#mySidebar").css({ "margin-right": "-250px" });
    $(".content-body").css({ "margin-right": "50px" });
    $('.content-body').css({ 'width': width - 50 + "px" });

  }
}


function ShowAndHideUserMenu() {
  if ($('.ras-dropdown-content').is(':visible')) {
    $(".ras-dropdown-content").fadeOut(300);
  } else {
    $(".ras-dropdown-content").fadeIn(300);
  }
}
},{}]},{},[1]);
