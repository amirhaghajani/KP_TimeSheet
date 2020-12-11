//const data = require('./data');

//___________جدول پایین صفحه ماهانه

const monthlyGrid =(function(){

    const moduleData={};

    function init(data){
        moduleData.data = data;
    }

    function InitMonthlyByProjectsGrid() {
        var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values[0]);
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetThisMonthData",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: function (response) {
                moduleData.data.thisMonthdata_set(response);
                $("#MonthlyPresence").text(response.presence);
                $("#MonthlyWorkHour").text(response.work);
                $("#MonthlyDefference").text(response.defference);
                $("#MonthlyPresencePercent").width(response.presencepercent);
                $("#MonthlyWorkHourPercent").width(response.workpercent);
                $("#MonthlyDefferencePercent").width(response.defferencepercent);
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
                field: "title",
                title: "عنوان پروژه"
            }, {
                field: "hour",
                title: "ساعت کار ثبت شده    "
            }]
        });
    
    }

    return {
        InitMonthlyByProjectsGrid: InitMonthlyByProjectsGrid,
        init: init
    };
})();







module.exports ={
    'InitMonthlyByProjectsGrid': monthlyGrid.InitMonthlyByProjectsGrid,
    init: monthlyGrid.init
    
}