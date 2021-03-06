const dataM = (function () {

    const moduleData = {};

    function init() {
        moduleData._SelDate = {};
        moduleData.CurrentUser = {};
        moduleData._TimeSheetData = [];
        moduleData._TimeSheetData_BeforProcess = [];
        moduleData._WorkHourOnProjects = [];
        moduleData._thisMonthdata = {};
        moduleData._WorkHours = [];
        moduleData._DayIndex = {};
        moduleData._SendWorkHourGrid = [];
        moduleData._thisPerioddata = [];
        moduleData._MonitorSentWorkHours = [];
        moduleData._AllSentCount = 0;
        moduleData._AllReadyForSent = 0;
        moduleData._presenceHour = 0;
        moduleData._TodayHistorys = [];

        moduleData._UserProjects=[];
        moduleData._Users=[];

        moduleData._history_sentWorkHour_data={};
    };

    return {
        init: init,
        moduleData: moduleData
    }

})();


module.exports = {
    init: dataM.init,

    'selDate_get': function () { return dataM.moduleData._SelDate; },
    'selDate_set': function (data) { dataM.moduleData._SelDate = data; },

    'timeSheetData_get': function () { return dataM.moduleData._TimeSheetData; },
    'timeSheetData_set': function (data) { dataM.moduleData._TimeSheetData = data; },

    'timeSheetData_beforProcess_get': function () { return dataM.moduleData._TimeSheetData_BeforProcess; },
    'timeSheetData_beforProcess_set': function (data) { dataM.moduleData._TimeSheetData_BeforProcess = data; },

    'todayHistory_get': function () { return dataM.moduleData._TodayHistorys; },
    'todayHistory_set': function (data) { dataM.moduleData._TodayHistorys = data; },

    'thisMonthdata_get': function () { return dataM.moduleData._thisMonthdata; },
    'thisMonthdata_set': function (data) { dataM.moduleData._thisMonthdata = data; },

    'workHours_get': function () { return dataM.moduleData._WorkHours; },
    'workHours_set': function (data) { dataM.moduleData._WorkHours = data; },

    'dayIndex_get': function () { return dataM.moduleData._DayIndex; },
    'dayIndex_set': function (data) { dataM.moduleData._DayIndex = data; },


    'userProjects_get': function () { return dataM.moduleData._UserProjects; },
    'userProjects_set': function (data) { dataM.moduleData._UserProjects = data; },

    'users_get': function () { return dataM.moduleData._Users; },
    'users_set': function (data) { dataM.moduleData._Users = data; },

    'history_sentWorkHour_data_get':function(){return dataM.moduleData._history_sentWorkHour_data;},
    'history_sentWorkHour_data_set':function(data){ dataM.moduleData._history_sentWorkHour_data= data;},
}