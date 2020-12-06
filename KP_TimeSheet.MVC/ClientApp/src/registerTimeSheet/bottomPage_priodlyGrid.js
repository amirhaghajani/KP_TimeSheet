const data = require('./data');
//___________________دوره جاری جدول پایین صفحه 

function InitPeriodlyByProjectsGrid() {

    var prmData = JSON.stringify(data.timeSheetData_get()[0].values);
    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetThisPeriodData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:prmData,
        success: function (response) {
            _thisPerioddata = response;
            $("#LblperHourCurrPeriod").text(response.Presence);
            $("#LblworkHourCurrPeriod").text(response.Work);
            $("#LblPeriodicallyDefference").text(response.Defference);
            $("#PRBperHourCurrPeriod").width(response.Presencepercent);
            $("#PRBworkHourCurrPeriod").width(response.Workpercent);
            $("#PRGPeriodicallyDefferencePercent").width(response.Defferencepercent);
        },
        error: function (e) {

        }
    });

    

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetThisPeriodProjects",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: KGRDPeriodically_OnInit,
        error: function (e) {

        }
    });
}

function KGRDPeriodically_OnInit(response) {

    $("#tblcurrperiod").kendoGrid({
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
            title: "ساعت کار ثبت شده"
        }]
    })

}

module.exports={
    'InitPeriodlyByProjectsGrid':InitPeriodlyByProjectsGrid
};