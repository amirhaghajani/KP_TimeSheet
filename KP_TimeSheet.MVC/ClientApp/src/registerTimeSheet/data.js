const dataM = (function(){

    const moduleData={};

    function init(){
        moduleData._SelDate={};
        moduleData.CurrentUser={};
        moduleData._TimeSheetData = [];
        moduleData._WorkHourOnProjects = [];
        moduleData._thisMonthdata = {};
        moduleData._WorkHours = [];
        moduleData._SendItem = {};
        moduleData._SendWorkHourGrid = [];
        moduleData._thisPerioddata = [];
        moduleData._MonitorSentWorkHours = [];
        moduleData._AllSentCount = 0;
        moduleData._AllReadyForSent = 0;
        moduleData._presenceHour = 0;
        moduleData._TodayHistorys = [];
    };

    return {
        init: init,
        moduleData: moduleData
    }

})();


module.exports={
    init:dataM.init,

    'selDate_get':function(){ return dataM.moduleData._SelDate;},
    'selDate_set':function(data){dataM.moduleData._SelDate = data;},

    'timeSheetData_get':function(){ return dataM.moduleData._TimeSheetData;},
    'timeSheetData_set':function(data){dataM.moduleData._TimeSheetData = data;},

    'todayHistory_get':function(){ return dataM.moduleData._TodayHistorys;},
    'todayHistory_set':function(data){dataM.moduleData._TodayHistorys = data;},

    'thisMonthdata_get':function(){ return dataM.moduleData._thisMonthdata;},
    'thisMonthdata_set':function(data){dataM.moduleData._thisMonthdata = data;},

    'workHours_get':function(){ return dataM.moduleData._WorkHours;},
    'workHours_set':function(data){dataM.moduleData._WorkHours = data;},

    'sendItem_get':function(){ return dataM.moduleData._SendItem;},
    'sendItem_set':function(data){dataM.moduleData._SendItem = data;},
}