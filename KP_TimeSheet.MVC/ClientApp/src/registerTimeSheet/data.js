
function init(){
    this._SelDate={};
    this.CurrentUser={};
    this._TimeSheetData = [];
    this._WorkHourOnProjects = [];
    this._thisMonthdata = {};
    this._WorkHours = [];
    this._SendItem = {};
    this._SendWorkHourGrid = [];
    this._thisPerioddata = [];
    this._MonitorSentWorkHours = [];
    this._AllSentCount = 0;
    this._AllReadyForSent = 0;
    this._presenceHour = 0;
    this._TodayHistorys = [];
}

module.exports={
    init:init,

    'selDate_get':function(){ return this._SelDate;},
    'selDate_set':function(data){this._SelDate = data;},

    'timeSheetData_get':function(){ return this._TimeSheetData;},
    'timeSheetData_set':function(data){this._TimeSheetData = data;},

    'todayHistory_get':function(){ return this._TodayHistorys;},
    'todayHistory_set':function(data){this._TodayHistorys = data;},

    'thisMonthdata_get':function(){ return this._thisMonthdata;},
    'thisMonthdata_set':function(data){this._thisMonthdata = data;},

    'workHours_get':function(){ return this._WorkHours;},
    'workHours_set':function(data){this._WorkHours = data;},

    'sendItem_get':function(){ return this._SendItem;},
    'sendItem_set':function(data){this._SendItem = data;},
}