const data = require('./data');

//___________جدول پایین صفحه ماهانه

function InitMonthlyByProjectsGrid() {
    var prmData = JSON.stringify(data.timeSheetData_get()[0].values[0]);
    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetThisMonthData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            _thisMonthdata = response;
            $("#MonthlyPresence").text(response.Presence);
            $("#MonthlyWorkHour").text(response.Work);
            $("#MonthlyDefference").text(response.Defference);
            $("#MonthlyPresencePercent").width(response.Presencepercent);
            $("#MonthlyWorkHourPercent").width(response.Workpercent);
            $("#MonthlyDefferencePercent").width(response.Defferencepercent);
        },
        error: function (e) {

        }
    });

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetThisMonthProjects",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: KGRDMonthly_OnInit,
        error: function (e) {

        }
    });
}

function KGRDMonthly_OnInit(response) {

    $("#tblcurrmonth").kendoGrid({
        dataSource: {
            transport: {
                read: function (e) {
                    e.success(response)
                }
            },
            pageSize: 20
        },
        height: 200,
        columns: [{
            field: "Title",
            title: "عنوان پروژه"
        }, {
            field: "Hour",
            title: "ساعت کار ثبت شده    "
        }]
    });

}


function Refresh_GrdEditWorkHour() {
    var prmData = JSON.stringify(data.timeSheetData_get()[0].values);
    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetRegistereCurrentPerioddWorkHours",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            _WorkHours = response;
            var g = $("#GrdEditWorkHour").data("kendoGrid");
            if(g) g.dataSource.read();
        },
        error: function (e) {
        }
    });
}

module.exports ={
    'InitMonthlyByProjectsGrid':InitMonthlyByProjectsGrid,
    'Refresh_GrdEditWorkHour':Refresh_GrdEditWorkHour
}