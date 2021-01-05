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
    $("#PresenceYesterday").text(response.presence);
    $("#WorkYesterday").text(response.work);
    $("#differenceYesterday").text(response.defference);
    $("#PresenceYesterdaypercent").width(response.presencepercent * 10);
    $("#workYesterdaypercent").width(response.workpercent * 10);
    $("#differentYesterdaypercent").width(response.defferencepercent * 10);

}

function Page_OnInitThisMonth(response) {
    _ThisMonthData = response

    $("#PresenceThisMonth").text(response.presence);
    $("#WorkThisMonth").text(response.work);
    $("#differenceThisMonth").text(response.defference);
    $("#PresenceThisMonthpercent").width(response.presencepercent);
    $("#workThisMonthpercent").width(response.workpercent);
    $("#differentThisMonthpercent").width(response.defferencepercent);


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

    $("#hoursWaitingToApprove").text(commonTimesheet.convertMinutsToTime(response.minutes));
    $("#hoursWaitingToApprovePercent").width(response.minutes);

}
