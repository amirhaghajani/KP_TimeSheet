
var service = (function () {

    const moduleData = {};

    function init(common) {
        moduleData.common = common;
    }





    return {
        init: init
    };

})();



module.exports = {
    init: service.init
}