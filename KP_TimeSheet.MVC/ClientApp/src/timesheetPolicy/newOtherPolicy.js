
var service = (function () {

    const moduleData = {};

    function init(common) {
        moduleData.common = common;
    }

    function openNewOtherPolicyWindow(){
        moduleData.common.openWindow('WNDEditAndAddOtherPolicy');
    }


    return {
        init: init,
        openNewOtherPolicyWindow: openNewOtherPolicyWindow
    };

})();



module.exports = {
    init: service.init,
    openNewOtherPolicyWindow : service.openNewOtherPolicyWindow
}