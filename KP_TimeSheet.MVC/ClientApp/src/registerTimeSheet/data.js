var _SelDate;
var CurrentUser;
var _TimeSheetData = [];
var _WorkHourOnProjects = [];
var _thisMonthdata = {};
var _WorkHours = [];
var _SendItem = {};
var _SendWorkHourGrid = [];
var _thisPerioddata = [];
var _MonitorSentWorkHours = [];
var _AllSentCount = 0;
var _AllReadyForSent = 0;
var _presenceHour = 0;
var _TodayHistorys = [];

module.exports={
    'selDate_get':()=> this._SelDate,
    'selDate_set':(data)=> this._SelDate = data,

    'timeSheetData_get':()=> this._TimeSheetData,
    'timeSheetData_set':(data)=> this._TimeSheetData = data,

}