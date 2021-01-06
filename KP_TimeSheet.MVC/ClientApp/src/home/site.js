const common = require('../common/common');
const commonTimesheet = require('../common/timesheet');

var _YesterdayData = [];
var _ThisMonthData = [];
common.loaderShow();

$(document).ready(function () {
    common.loaderShow();
    GetHomeData();
});

function GetHomeData() {

    $.ajax({
        type: "Get",
        url: `/api/TimeSheetsAPI/GetYesterdayData/${common.version()}`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: Page_OnInitYesterday,
        error: function (e) {

            if (e.responseText) {
                common.notify(e.responseText, 'danger');
                common.loaderHide();
            }

        }
    });


}

function Page_OnInitYesterday(response) {
    $.ajax({
        type: "Get",
        url: "/api/TimeSheetsAPI/GetThisMonthDataForHomePage",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: Page_OnInitThisMonth,
        error: function (e) {

        }
    });

    _YesterdayData = response;

    $("#UsenNameSidebar").text(response.currentUser);
    $("#currentUser").text(response.currentUser);

debugger;
    const items = [response.presence, response.work, response.defference];
    const v1 = commonTimesheet.calcPercent(items, response.presence);
    const v2 = commonTimesheet.calcPercent(items, response.work);
    const v3 = commonTimesheet.calcPercent(items, response.defference);

    $("#PresenceYesterday").text(commonTimesheet.convertMinutsToTime(response.presence));
    $("#WorkYesterday").text(commonTimesheet.convertMinutsToTime(response.work));
    $("#differenceYesterday").text(commonTimesheet.convertMinutsToTime(response.defference));
    $("#PresenceYesterdaypercent").css('width', v1+'%').attr('aria-valuenow', v1);
    $("#workYesterdaypercent").css('width', v2+'%').attr('aria-valuenow', v2);
    $("#differentYesterdaypercent").css('width', v3+'%').attr('aria-valuenow', v3);

}

function Page_OnInitThisMonth(response) {
    _ThisMonthData = response

    const items = [response.presence, response.work, response.defference];
    const v1 = commonTimesheet.calcPercent(items, response.presence);
    const v2 = commonTimesheet.calcPercent(items, response.work);
    const v3 = commonTimesheet.calcPercent(items, response.defference);

    $("#PresenceThisMonth").text(commonTimesheet.convertMinutsToTime(response.presence));
    $("#WorkThisMonth").text(commonTimesheet.convertMinutsToTime(response.work));
    $("#differenceThisMonth").text(commonTimesheet.convertMinutsToTime(response.defference));
    $("#PresenceThisMonthpercent").css('width', v1+'%').attr('aria-valuenow', v1);
    $("#workThisMonthpercent").css('width', v2+'%').attr('aria-valuenow', v2);
    $("#differentThisMonthpercent").css('width', v3+'%').attr('aria-valuenow', v3);


    $.ajax({
        type: "Get",
        url: "/api/TimeSheetsAPI/GetWaitingForApproveSumTime",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: Page_OnInitWaitApprove,
        error: function (e) {

        }
    });

    common.loaderHide()

}

function Page_OnInitWaitApprove(response) {

    const items = [response.minutes];
    const v1 = commonTimesheet.calcPercent(items, response.minutes);

    $("#hoursWaitingToApprove").text(commonTimesheet.convertMinutsToTime(response.presence));
    $("#hoursWaitingToApprovePercent").css('width', v1 + '%').attr('aria-valuenow', v1);

}
