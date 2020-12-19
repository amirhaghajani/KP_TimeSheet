const dataM = (function () {

    const moduleData = {};

    


    function init() {
        moduleData._Users = [];
        moduleData._TimeSheetDataConfirm = [];
        moduleData.SelectedTaskIdForDeny = "";
        moduleData.SelectedIndexDorDeny = 0;
        moduleData._thisMonthdataConfirm = [];
        moduleData._UserId = "";
    }

    return {
        init: init,
        moduleData: moduleData,
    }

})();

module.exports = {
    init: dataM.init,

    'users_get': function () { return dataM.moduleData._Users; },
    'users_set': function (data) { dataM.moduleData._Users = data; },

    'timeSheetDataConfirm_get': function () { return dataM.moduleData._TimeSheetDataConfirm; },
    'timeSheetDataConfirm_set': function (data) { dataM.moduleData._TimeSheetDataConfirm = data; },

    'selectedTaskIdForDeny_get': function () { return dataM.moduleData.SelectedTaskIdForDeny; },
    'selectedTaskIdForDeny_set': function (data) { dataM.moduleData.SelectedTaskIdForDeny = data; },

    'selectedIndexDorDeny_get': function () { return dataM.moduleData.SelectedIndexDorDeny; },
    'selectedIndexDorDeny_set': function (data) { dataM.moduleData.SelectedIndexDorDeny = data; },

    'thisMonthdataConfirm_get': function () { return dataM.moduleData._thisMonthdataConfirm; },
    'thisMonthdataConfirm_set': function (data) { dataM.moduleData._thisMonthdataConfirm = data; },

    'userId_get': function () { return dataM.moduleData._UserId; },
    'userId_set': function (data) { dataM.moduleData._UserId = data; },

};