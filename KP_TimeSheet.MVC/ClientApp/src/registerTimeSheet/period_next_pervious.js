//_________صفحه بعد و قبل 
const period_next_pervious = (function () {

    const moduleData = {};

    function init(common, common_register, mainGrid, monthlyGrid,
        history_sentWorkHour, priodlyGrid, editWindow, data, service,serviceConfirm) {

        moduleData.common_register = common_register;
        moduleData.common = common;
        moduleData.mainGrid = mainGrid;
        moduleData.monthlyGrid = monthlyGrid;
        moduleData.history_sentWorkHour = history_sentWorkHour;
        moduleData.priodlyGrid = priodlyGrid;
        moduleData.editWindow = editWindow;
        moduleData.data = data;
        moduleData.service = service;
        moduleData.serviceConfirm = serviceConfirm;

        $('#btnpreviousPeriod').off().on('click', function () {
            GetNextPeriod('previous');
        });

        $('#btnSelectPeriod').off().on('click', function () {
            kwndSelectPeriod_OnInit();
        });

        $('#btnNextPeriod').off().on('click', function () {
            GetNextPeriod('next');
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

    function GetNextPeriod(type) {
        moduleData.common.loaderShow();

        let prmData = moduleData.data.timeSheetData_get()[0].values[moduleData.data.timeSheetData_get()[0].values.length - 1];

        if (type == 'previous') {
            prmData = moduleData.data.timeSheetData_get()[0].values[0];
        }

        moduleData.service.getNextTimeSheets(type, prmData.date, (response) => {

            moduleData.common_register.removeAndRecreateTreelisDiv();
            moduleData.mainGrid.Init_TimeSheetTreeList();
            moduleData.editWindow.Refresh_GrdEditWorkHour();
            moduleData.history_sentWorkHour.Refresh_GrdMonitorSentWorkHour();
            moduleData.priodlyGrid.InitPeriodlyByProjectsGrid();
            moduleData.monthlyGrid.InitMonthlyByProjectsGrid();
            moduleData.common.loaderHide();

        });
    }



    function GetCurrentPeriod() {

        moduleData.mainGrid.RefreshTimeSheet(false);

        // moduleData.common.loaderShow();

        // var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values);

        // $.ajax({
        //     type: "Post",
        //     url: "/api/TimeSheetsAPI/GetCurrentPeriod",
        //     contentType: "application/json; charset=utf-8",
        //     dataType: "json",
        //     data: prmData,
        //     success: function (response) {

        //         moduleData.data.timeSheetData_set(response);
        //         moduleData.common_register.removeAndRecreateTreelisDiv();
        //         moduleData.mainGrid.Init_TimeSheetTreeList();
        //         moduleData.editWindow.Refresh_GrdEditWorkHour();
        //         moduleData.history_sentWorkHour.Refresh_GrdMonitorSentWorkHour();
        //         moduleData.priodlyGrid.InitPeriodlyByProjectsGrid();
        //         moduleData.monthlyGrid.InitMonthlyByProjectsGrid();
        //         moduleData.common.loaderHide();
        //     },
        //     error: function (e) {

        //     }
        // });
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

            moduleData.serviceConfirm.changeDisplayPeriodToWeeklyConfirm(() => {
                moduleData.mainGrid.RefreshTimeSheet(true);
            });

        }
        else {
            var PeriodJson = {
                Date: $("#startDate").val(),
                Days: $("#numberDays").val(),
                IsWeekly: false
            };

            var prmData = JSON.stringify(PeriodJson);

            moduleData.serviceConfirm.changeDisplayPeriodToDaily(prmData, () => {
                moduleData.mainGrid.RefreshTimeSheet(true);
            });
        }

    }

    return {
        init: init,
        GetCurrentPeriod: GetCurrentPeriod
    };
})();




module.exports = {
    "init": period_next_pervious.init,
    "GetCurrentPeriod": period_next_pervious.GetCurrentPeriod
}