//const data = require('./data');

//___________جدول پایین صفحه ماهانه

const monthlyGrid =(function(){

    const moduleData={};

    function init(data, common_timeSheet){
        moduleData.data = data;
        moduleData.common_timeSheet = common_timeSheet;

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
                const items = [response.presencepercent, response.workpercent, response.defferencepercent];
                const v1= moduleData.common_timeSheet.calcPercent(items, response.presencepercent);
                const v2 = moduleData.common_timeSheet.calcPercent(items, response.workpercent);
                const v3 = moduleData.common_timeSheet.calcPercent(items, response.defferencepercent);

                moduleData.data.thisMonthdata_set(response);
                $("#MonthlyPresence").text(moduleData.common_timeSheet.convertMinutsToTime(response.presence));
                $("#MonthlyWorkHour").text(moduleData.common_timeSheet.convertMinutsToTime(response.work));
                $("#MonthlyDefference").text(moduleData.common_timeSheet.convertMinutsToTime(response.defference));
                $("#MonthlyPresencePercent").css('width', v1+'%').attr('aria-valuenow', v1);
                $("#MonthlyWorkHourPercent").css('width', v2+'%').attr('aria-valuenow', v2);
                $("#MonthlyDefferencePercent").css('width', v3+'%').attr('aria-valuenow', v3);
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