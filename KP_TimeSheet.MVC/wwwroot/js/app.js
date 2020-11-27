(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var $ =require("jquery");


var weather = require('./weather');
weather.getForecast();
var a=111111111111111;
$('#test').text();

MyApp.Home = (function () {
    var initialise = function () {
        $(".button").on("click", function () {
            MyApp.Messages.generateMessage(greetingMessage);
        });
    };
    return {
        initialise: initialise
    };
})();
},{"./weather":2,"jquery":undefined}],2:[function(require,module,exports){
module.exports = {
    'getForecast': function () {
        document.getElementById('forecast').innerHTML = 'Partly cloudy.';
    }
};
},{}]},{},[1]);
