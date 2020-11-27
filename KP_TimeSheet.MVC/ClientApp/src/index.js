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