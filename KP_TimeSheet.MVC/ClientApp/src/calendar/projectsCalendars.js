var _Projectscalendars = [];
var _currnetProjectsCalendar = null;
var _CalendarDataCombo = [];
var _managerDataCombo = [1, 2, 3, 4];
$(document).ready(function () {
    $('#addNewPopUp').attr("style", "display: none !important");
    GetProjectsCalenderItems();
});


function btnAddProjectCalender() {
    $("#dataTable").css("display", "none");
    $('#addNewPopUp').attr("style", "");
    $('#myTab').css("display", "none");

}

function selectCalendar() {
    $("#calendar").kendoComboBox({
        dataSource: _CalendarDataCombo

    })
}

function selectmanager() {
    $("#manager").kendoComboBox({

        dataSource: _managerDataCombo

    })
}




$(document).ready(function () {

    GetProjectsCalenderItems();
});



function GetProjectsCalenderItems() {
    $.ajax({
        type: "Get",
        url: "/api/ProjectsCalender/GetCalendarItems",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnGetProjectsCalenderItemsSuccess
    });
}

function OnGetProjectsCalenderItemsSuccess(data) {
    _Projectscalendars = data;
    ShowProjectsCalenderTable();
}


function ShowProjectsCalenderTable() {

}

function FillForm() {
    $("#TITLE").val(_currnetCalendar.Title);
    if (_currnetCalendar.IsSaturdayWD)
        $("#Sa").prop("checked", true);
    if (_currnetCalendar.IsSundayWD)
        $("#Su").prop("checked", true);
    if (_currnetCalendar.IsMondayWD)
        $("#Mo").prop("checked", true);
    if (_currnetCalendar.IsTuesdayWD)
        $("#Tu").prop("checked", true);
    if (_currnetCalendar.IsWednesdayWD)
        $("#We").prop("checked", true);
    if (_currnetCalendar.IsThursdayWD)
        $("#Th").prop("checked", true);
    if (_currnetCalendar.IsFridayWD)
        $("#Fr").prop("checked", true);
    ShowHolidayTable();
}





function FillCurrent() {
    _currnetProjectsCalendar.Title = $("#TITLE").val();

}

function btnAddClick() {
    $.ajax({
        type: "Get",
        // url: "/api/LoadCalender/BuildCalendar",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnBuildProjectsCalendarSuccess
    });

}

function OnBuildProjectsCalendarSuccess(data) {
    _currnetProjectsCalendar = data;
    FillForm();

}

function Save() {
    FillCurrent();
    var json = JSON.stringify(_currnetProjectsCalendar);
    $.ajax({
        type: "Post",
        // url: "/api/LoadCalender/Save",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: json,
        success: function (data) {

        }
    });
}

function Discard() {
    $("title").val("");
    $("calendar").val("");
    $("manager").val("");
    $("#dataTable").css("display", "block");
    $('#addNewPopUp').attr("style", "display: none !important");
    $('#myTab').css("display", "block");

}