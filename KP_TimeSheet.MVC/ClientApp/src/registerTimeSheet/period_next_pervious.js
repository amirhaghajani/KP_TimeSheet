// const common_register = require('./common');
// const common = require('../common/common');
// const data = require('./data');
// const mainGrid = require('./mainGrid');
// const monthlyGrid = require('./bottomPage_monthlyGrid');
// const sended_workouts = require('./history_sentWorkHour');
// const priodlyGrid = require('./bottomPage_priodlyGrid');
// const editWindow = require('./editWorkHour');

//_________صفحه بعد و قبل 
const period_next_pervious = (function(){

    const moduleData={};

    function init(common, common_register,  mainGrid,monthlyGrid, 
        history_sentWorkHour, priodlyGrid, editWindow, data) {

        moduleData.common_register = common_register;
        moduleData.common = common;
        moduleData.mainGrid = mainGrid;
        moduleData.monthlyGrid = monthlyGrid;
        moduleData.history_sentWorkHour = history_sentWorkHour;
        moduleData.priodlyGrid = priodlyGrid;
        moduleData.editWindow = editWindow;
        moduleData.data = data;

        $('#btnpreviousPeriod').off().on('click', function () {
            GetPreviousPeriod();
        });
    
        $('#btnSelectPeriod').off().on('click', function () {
            kwndSelectPeriod_OnInit();
        });
    
        $('#btnNextPeriod').off().on('click', function () {
            GetNextPeriod();
        });
    
        //دو تا دکمه تایید و کنسل در فرمی که تعداد روزهای صفحه را مشخص می کنه
        $('#btnSendPeriod_determinPeriod').off().on('click', function () {
            btnSendPeriods_Onclick();
        });
    
        $('#btnCancel_determinPeriod').off().on('click', function () {
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
        moduleData.common.loaderShow();
    
        var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values[moduleData.data.timeSheetData_get()[0].values.length - 1]);
    
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetNextPeriod",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: function (response) {
                moduleData.data.timeSheetData_set(response);
                moduleData.common_register.removeAndRecreateTreelisDiv();
                moduleData.mainGrid.Init_TimeSheetTreeList();
                moduleData.editWindow.Refresh_GrdEditWorkHour();
                moduleData.history_sentWorkHour.Refresh_GrdMonitorSentWorkHour();
                moduleData.priodlyGrid.InitPeriodlyByProjectsGrid();
                moduleData.monthlyGrid.InitMonthlyByProjectsGrid();
                moduleData.common.loaderHide();
            },
            error: function (e) {
    
            }
        });
    }
    
    function GetPreviousPeriod() {
        moduleData.common.loaderShow();
    
        var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values[0]);
    
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetPreviousPeriod",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: function (response) {
    
                moduleData.data.timeSheetData_set(response);
                moduleData.common_register.removeAndRecreateTreelisDiv();
                moduleData.mainGrid.Init_TimeSheetTreeList();
                moduleData.editWindow.Refresh_GrdEditWorkHour();
                moduleData.history_sentWorkHour.Refresh_GrdMonitorSentWorkHour();
                moduleData.priodlyGrid.InitPeriodlyByProjectsGrid();
                moduleData.monthlyGrid.InitMonthlyByProjectsGrid();
    
                moduleData.common.loaderHide();
    
            },
            error: function (e) {
    
            }
        });
    
    
    
    
    }
    
    function GetCurrentPeriod() {
        moduleData.common.loaderShow();

        var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values);
    
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetCurrentPeriod",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: function (response) {

                moduleData.data.timeSheetData_set(response);
                moduleData.common_register.removeAndRecreateTreelisDiv();
                moduleData.mainGrid.Init_TimeSheetTreeList();
                moduleData.editWindow.Refresh_GrdEditWorkHour();
                moduleData.history_sentWorkHour.Refresh_GrdMonitorSentWorkHour();
                moduleData.priodlyGrid.InitPeriodlyByProjectsGrid();
                moduleData.monthlyGrid.InitMonthlyByProjectsGrid();
                moduleData.common.loaderHide();
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
            open: moduleData.common.adjustSize,
        }).data("kendoWindow").center().open();
    }
    
    function kwndSelectPeriod_OnClose() {
        $("#kwndSelectTimePeriod").data("kendoWindow").close()
    }
    
    /////----------------- دکمه تایید تعداد روزهای دوره که باید نشان بده 
    
    function btnSendPeriods_Onclick() {
        moduleData.common.loaderShow();
        kwndSelectPeriod_OnClose();
    
    
        if ($('#chkweekly').is(':checked')) {
            $.ajax({
                type: "Get",
                url: "/api/TimeSheetsAPI/ChangeDisplayPeriodToWeekly",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    moduleData.data.timeSheetData_set(response);
                    moduleData.common_register.removeAndRecreateTreelisDiv();
                    moduleData.mainGrid.Init_TimeSheetTreeList();
                    moduleData.editWindow.Refresh_GrdEditWorkHour();
                    moduleData.history_sentWorkHour.Refresh_GrdMonitorSentWorkHour();
                    moduleData.common.loaderHide();
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
                    moduleData.data.timeSheetData_set(response);
                    moduleData.common_register.removeAndRecreateTreelisDiv();
                    moduleData.mainGrid.Init_TimeSheetTreeList();
                    moduleData.common.loaderHide();
                },
                error: function (e) {
    
                }
            });
        }
    
    }

    return {
        init:init,
        GetCurrentPeriod: GetCurrentPeriod
    };
})();




module.exports = {
    "init": period_next_pervious.init,
    "GetCurrentPeriod":  period_next_pervious.GetCurrentPeriod
}