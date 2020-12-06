const common_register = require('./common');
const common = require('../common/common');
const data = require('./data');
const mainGrid = require('./mainGrid');
const monthlyGrid = require('./bottomPage_monthlyGrid');
const sended_workouts =require('./history_sentWorkHour');
const priodlyGrid = require('./bottomPage_priodlyGrid');
const editWindow = require('./editWorkHour');

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

    //دو تا دکمه تایید و کنسل در فرمی که تعداد روزهای صفحه را مشخص می کنه
    $('#btnSendPeriod_determinPeriod').off().on('click',function(){
        btnSendPeriods_Onclick();
    });

    $('#btnCancel_determinPeriod').off().on('click',function(){
        kwndSelectPeriod_OnClose();
    });


    //دو تا کمبو تعداد روز هایی که در دوره نشان بده
    $('input:radio[name="optperiod"]').change(function () {

        EnableAndDisableSendPeriodRadioButton(this);
    
    });
    
    $("#numberDays").keyup(function () {
    
        if ($("#numberDays").val() > 25) {
            $("#numberDays").val("25");
        }
    });

}

function EnableAndDisableSendPeriodRadioButton() {
    if ($("#numberDays").is(':disabled')) {

        $("#numberDays").prop("disabled", false);
        $("#startDate").prop("disabled", false);

    } else {
        $("#numberDays").prop("disabled", true);
        $("#startDate").prop("disabled", true);
    }

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
            editWindow.Refresh_GrdEditWorkHour();
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
            editWindow.Refresh_GrdEditWorkHour();
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
            editWindow.Refresh_GrdEditWorkHour();
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

/////----------------- دکمه تایید تعداد روزهای دوره که باید نشان بده 

function btnSendPeriods_Onclick() {
    common.LoaderShow();
    kwndSelectPeriod_OnClose();


    if ($('#chkweekly').is(':checked')) {
        $.ajax({
            type: "Get",
            url: "/api/TimeSheetsAPI/ChangeDisplayPeriodToWeekly",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                data.timeSheetData_set(response);
                common_register.removeAndRecreateTreelisDiv();
                mainGrid.Init_TimeSheetTreeList();
                editWindow.Refresh_GrdEditWorkHour();
                sended_workouts.Refresh_GrdMonitorSentWorkHour();
                common.LoaderHide();
            },
            error: function (e) {

            }
        });

    }
    else {
        var PeriodJson = {
            Date: $("#startDate").val(),
            Days: $("#numberDays").val(),
            IsWeekly: false
        };

        var prmData = JSON.stringify(PeriodJson);

        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetTimeSheetsByDateAndNumberOfDay",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: function (response) {
                data.timeSheetData_set(response);
                common_register.removeAndRecreateTreelisDiv();
                mainGrid.Init_TimeSheetTreeList();
                common.LoaderHide();
            },
            error: function (e) {

            }
        });
    }

}


module.exports={
    "init":init
}