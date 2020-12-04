const data = require('./data');

//_________________________________________ناریخچه___________________________________
function init() {
    $('#btnWorkHoureHistory_hide').off().on('click', function () {
        HideHistory();
    });
}

function Init_GRDHistory(e) {
    common.LoaderShow();

    var grid = $("#GrdMonitorSentWorkHour").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));
    var prmData = JSON.stringify(dataItem);
    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetHistoryWorkHour",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            debugger;
            data.todayHistory_set(response);
            $("#WorkHourHistory").data("kendoGrid").dataSource.read();
            ShowHistory();
            common.LoaderHide();
        },
        error: function (e) {

        }
    });
}

function Create_GrdHistory() {

    $("#WorkHourHistory").kendoGrid({
        dataSource: {
            transport: {
                read: function (e) {
                    e.success(data.todayHistory_get())
                }
            },
            pageSize: 10
        },
        height: 450,
        pageable: true,
        filterable: true,
        selectable: true,

        columns: [{
            field: "PersianDate",
            title: "تاریخ",
            width: 80
        },
        {
            field: "Time",
            title: "ساعت",
            width: 80
        },
        {
            field: "ManagerName",
            title: "نام مدیر",
            width: 200
        }, {
            field: "Action",
            title: "عملیات",
            width: 120
        }, {
            field: "StageTitle",
            title: "مرحله",
            width: 120

        }, {
            field: "Description",
            title: "توضیحات",
            width: 400

        }
        ]

    });
}

function ShowHistory() {
    $("#PanelMonitorWorkHour").fadeOut(400);
    $("#PanelHistory").fadeIn(400);
}

function HideHistory() {
    $("#PanelMonitorWorkHour").fadeIn(400);
    $("#PanelHistory").fadeOut(400);
}

module.exports = {
    'Create_GrdHistory': Create_GrdHistory,
    'HideHistory': HideHistory
}