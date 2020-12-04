const common_register = require('./common');
const common = require('../common/common');
const data = require('./data');
const mainGrid = require('./mainGrid');
const monthlyGrid = require('./monthlyGrid');
const sended_workouts =require('./sended_workouts');
const priodlyGrid = require('./priodlyGrid');

//_________صفحه بعد و قبل 
function init(){
    $('#btnpreviousPeriod').off().on('click',function(){
        GetPreviousPeriod();
    });

    $('#btnSelectPeriod').off().on('click',function(){
        kwndSelectPeriod_OnInit();
    });

    $('#btnNextPeriod').off().on('click',function(){
        GetNextPeriod();
    });
}

function GetNextPeriod() {
    common.LoaderShow();

    var prmData = JSON.stringify(data.timeSheetData_get()[0].values[data.timeSheetData_get()[0].values.length - 1]);

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetNextPeriod",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            data.timeSheetData_set(response);
            common_register.removeAndRecreateTreelisDiv();
            mainGrid.Init_TimeSheetTreeList();
            monthlyGrid.Refresh_GrdEditWorkHour();
            sended_workouts.Refresh_GrdMonitorSentWorkHour();
            priodlyGrid.InitPeriodlyByProjectsGrid();
            monthlyGrid.InitMonthlyByProjectsGrid();
            common.LoaderHide();
        },
        error: function (e) {

        }
    });
}

function GetPreviousPeriod() {
    common.LoaderShow();

    var prmData = JSON.stringify(data.timeSheetData_get()[0].values[0]);

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetPreviousPeriod",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {

            data.timeSheetData_set(response);
            common_register.removeAndRecreateTreelisDiv();
            mainGrid.Init_TimeSheetTreeList();
            monthlyGrid.Refresh_GrdEditWorkHour();
            sended_workouts.Refresh_GrdMonitorSentWorkHour();
            priodlyGrid.InitPeriodlyByProjectsGrid();
            monthlyGrid.InitMonthlyByProjectsGrid();

            common.LoaderHide();

        },
        error: function (e) {

        }
    });




}

function GetCurrentPeriod() {
    common.LoaderShow();
    var prmData = JSON.stringify(data.timeSheetData_get()[0].values);

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetCurrentPeriod",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            data.timeSheetData_set(response);
            common_register.removeAndRecreateTreelisDiv();
            mainGrid.Init_TimeSheetTreeList();
            monthlyGrid.Refresh_GrdEditWorkHour();
            sended_workouts.Refresh_GrdMonitorSentWorkHour();
            priodlyGrid.InitPeriodlyByProjectsGrid();
            monthlyGrid.InitMonthlyByProjectsGrid();
            common.LoaderHide();
        },
        error: function (e) {

        }
    });
}



function kwndSelectPeriod_OnInit() {

    var kwndSendWHs = $("#kwndSelectTimePeriod");
    kwndSendWHs.kendoWindow({
        width: "600px",
        height: "290px",
        scrollable: false,
        visible: false,
        modal: true,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
        open: common_register.adjustSize,
    }).data("kendoWindow").center().open();
}

function kwndSelectPeriod_OnClose() {
    $("#kwndSelectTimePeriod").data("kendoWindow").close()
}


module.exports={
    "init":init
}