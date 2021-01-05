//const data = require('./data');
//___________________دوره جاری جدول پایین صفحه 

const priodGrid = (function () {

    const moduleData={};

    function init(data,common_timeSheet) {
        moduleData.data = data;
        moduleData.common_timeSheet = common_timeSheet;
    }

    function InitPeriodlyByProjectsGrid() {

        var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values);
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetThisPeriodData",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: function (response) {
                _thisPerioddata = response;

                const items = [response.presencepercent, response.workpercent, response.defferencepercent];
                const v1= moduleData.common_timeSheet.calcPercent(items, response.presencepercent);
                const v2 = moduleData.common_timeSheet.calcPercent(items, response.workpercent);
                const v3 = moduleData.common_timeSheet.calcPercent(items, response.defferencepercent);

                $("#LblperHourCurrPeriod").text(moduleData.common_timeSheet.convertMinutsToTime(response.presence));
                $("#LblworkHourCurrPeriod").text(moduleData.common_timeSheet.convertMinutsToTime(response.work));
                $("#LblPeriodicallyDefference").text(moduleData.common_timeSheet.convertMinutsToTime(response.defference));
                $("#PRBperHourCurrPeriod").css('width', v1+'%').attr('aria-valuenow', v1);
                $("#PRBworkHourCurrPeriod").css('width', v2+'%').attr('aria-valuenow', v2);
                $("#PRGPeriodicallyDefferencePercent").css('width', v3+'%').attr('aria-valuenow', v3);
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
                field: "title",
                title: "عنوان پروژه"
            }, {
                field: "hour",
                title: "ساعت کار ثبت شده"
            }]
        })

    }

    return {
        init:init,
        InitPeriodlyByProjectsGrid: InitPeriodlyByProjectsGrid
    };

})();



module.exports = {
    'InitPeriodlyByProjectsGrid': priodGrid.InitPeriodlyByProjectsGrid,
    init:priodGrid.init
};