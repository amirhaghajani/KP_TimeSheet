﻿const common = require('../common/common');

var _calendars = [];
var _currnetCalendar = null;
var _holidayList = [];
var _UsersCalendar = [];
var _ProjectsCalendar = [];
var SentAssignment = {
    ProjectId: "",
    CalendarId:"",
    UserId: "",
};
var _SelectedCalendar =  "";
//-------------------------------------------تقویم

$("document").ready(function () {

    GetCalenderItems();
   

   
});



function RefreshCalendarGRD(){
 common.loaderShow();
  $.ajax({
        type: "Get",
        url: "/api/LoadCalendar/GetCalendarItems",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response){

    _calendars = response;
   ShowCalenderTable();
    common.loaderHide();

  
},
        error: function (e) {
        }
    });

}
 

function GetCalenderItems() {
    common.loaderShow();
    $.ajax({
        type: "Get",
        url: "/api/LoadCalendar/GetCalendarItems",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnGetCalenderItemsSuccess,
        error: function (e) {
        }
    });
}

function OnGetCalenderItemsSuccess(data) {
    GetProjetsCalendar();
    _calendars = data;
    ShowCalenderTable();
    GetUsersCalendar();
}

function Init_WNDAssign() {
    $("#WNDAssignCalendar").kendoWindow({
        width: "1100px",
        height: "830px",
        scrollable:false,
        close: DiscardAllSetting,
        modal: true,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
        open: adjustSize,
    }).data("kendoWindow").center().close();

}

function Init_WNDhome() {
    $("#home").kendoWindow({
        width: "600px",
        height: "700px",
 scrollable: true,
       
        close: DiscardAllSetting,
        modal: true,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
        open: adjustSize,
    }).data("kendoWindow").center().close();
}

function ShowCalenderTable() {

    $("#kgrdCalendars").kendoGrid({
        dataSource: {
            transport: {
                read: function (e) {
                    e.success(_calendars);
                }
            },
            schema: {

                model: {
                    id: "ID"
                },
               
            }
        },
        height: 650,
        toolbar:"<a class='btn btn-info' id='home-tab'   onClick='btnAddClick()' >افزودن تقویم جدید</a> <a onClick='WNDAssignCalendar_OnInit()' class='btn btn-info'> تخصیص تقویم و مدیر به پروژه</a>",
        filterable: true,
        sortable: true,
        selectable:true,
        columns: [
            { field: "title", title: "عنوان", width: 160 },
            { field: "assignStatus", title: "وضعیت تخصیص", width: 160 },

            {
                title: "حذف ",
                template:  "<button  id='undo' onclick='LoadModal(this)'  type='button' class='btn btn-danger btn-sm' name='info' title='حذف' > حذف</button>",
                headerTemplate: "<label class='text-center'> حذف </label>",
                filterable: false,
                sortable: false,
                width: 30
            },
            {
                title: "ویرایش ",
                template: "<button onclick='Edit(this)' type='button' class='btn btn-warning btn-sm edit' name='info' title='ویرایش' > ویرایش</button>",
                headerTemplate: "<label class='text-center'> ویرایش </label>",
                filterable: false,
                sortable: false,
                width: 30
            }
        ],
        pageable: {
            pageSize: 15,
            pageSizes: true
        }
    });

    $("#kgrdCalendars").data("kendoGrid").dataSource.read();

}

function Delete() {
    $.ajax({
        type: "Get",
        url: "/api/LoadCalendar/DeleteCalendarItem?calendarID=" + _SelectedCalendar,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (message) {
            Notify(message, "danger");
          _SelectedCalendar = "";
           RefreshCalendarGRD()
           ResetAssignForm();
        }
    });
}

function Edit(e) {
    $("#home").data("kendoWindow").open();
    var grid = $("#kgrdCalendars").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));
   
    for (var i = 0; i < _calendars.length; i++) {
        if (_calendars[i].ID === dataItem.ID)
            _currnetCalendar = _calendars[i];

    }
    for (var i = 0; i < _currnetCalendar.Holidays.length; i++) {
        _holidayList.push({ Date: _currnetCalendar.Holidays[i].Date, ID: _currnetCalendar.Holidays[i].ID });
    }
    UnCheckedCheckBox();
    FillForm();
   


}

function Close_WndEditAndAdd() {
    DiscardAllSetting()
    $("#home").data("kendoWindow").close()
}

function LoadModal(e) {
;
    var grid = $("#kgrdCalendars").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));
  _SelectedCalendar= dataItem.ID;
  $("#DeleteDialog").kendoDialog({
            visible: true,
            width: "450px",
            title: "حذف تقویم انتخاب شده",
            closable: true,
            modal: true,
            content: "<p>ایا از خذف  <strong>"+dataItem.Title+"</strong> اطمینان دارید?<p>",
            actions: [
                { text: 'بله', action : Delete},
                { text: 'خیر' ,action: function(){}},
            ],
            close: function(){

}
        });

       $("#DeleteDialog").data("kendoDialog").open();

  
}

function FillForm() {

    $("#TITLE").val(_currnetCalendar.title);
    if (_currnetCalendar.isSaturdayWD)
        $("#Sa").prop("checked", true);
    if (_currnetCalendar.isSundayWD)
        $("#Su").prop("checked", true);
    if (_currnetCalendar.isMondayWD)
        $("#Mo").prop("checked", true);
    if (_currnetCalendar.isTuesdayWD)
        $("#Tu").prop("checked", true);
    if (_currnetCalendar.isWednesdayWD)
        $("#We").prop("checked", true);
    if (_currnetCalendar.isThursdayWD)
        $("#Th").prop("checked", true);
    if (_currnetCalendar.isFridayWD)
        $("#Fr").prop("checked", true);
    ShowHolidayTable();



}

function AddVacDate() {
    var Date = $("#VacDate").val()

    for (var i = 0; i < _holidayList.length; i++)
        if (_holidayList[i].date === Date) {
            //notiy

            return;
        }

    _holidayList.push({ Date: Date });
    ShowHolidayTable();

}

function ShowHolidayTable() {
    var ul = "";
    for (var i = 0; i < _holidayList.length; i++)
        ul += "<tr><th scope='row'>" + (i + 1) + "</th><td>" + _holidayList[i].Date +
            "</td><td><input style='background:#cc0000' type='button' class='btnRegister' value='حذف' onClick='DeleteHoliday(\"" + _holidayList[i].Date + "\")' /></td></tr>";
    document.getElementById("Dates").innerHTML = ul;

}

function DeleteHoliday(date) {
    var temp = [];
    for (var i = 0; i < _holidayList.length; i++)
        if (_holidayList[i].Date != date)
            temp.push({ Date: _holidayList[i].Date, ID: _holidayList[i].ID });
    _holidayList = temp;
    ShowHolidayTable();
}

function FillCurrent() {
    _currnetCalendar.Title = $("#TITLE").val();
    if ($('#Sa')[0].checked == true)
        _currnetCalendar.isSaturdayWD = 1;
    else
        _currnetCalendar.isSaturdayWD = 0;
    if ($('#Su')[0].checked == true)
        _currnetCalendar.isSundayWD = 1;
    else
        _currnetCalendar.isSundayWD = 0;
    if ($('#Mo')[0].checked == true)
        _currnetCalendar.isMondayWD = 1;
    else
        _currnetCalendar.isMondayWD = 0;
    if ($('#Tu')[0].checked == true)
        _currnetCalendar.isTuesdayWD = 1;
    else
        _currnetCalendar.isTuesdayWD = 0;
    if ($('#We')[0].checked == true)
        _currnetCalendar.isWednesdayWD = 1;
    else
        _currnetCalendar.iWednesdayWD = 0;
    if ($('#Th')[0].checked == true)
        _currnetCalendar.isThursdayWD = 1;
    else
        _currnetCalendar.isThursdayWD = 0;
    if ($('#Fr')[0].checked == true)
        _currnetCalendar.isFridayWD = 1;
    else
        _currnetCalendar.isFridayWD = 0;
    _currnetCalendar.holidays = _holidayList;

}

function btnAddClick() {
    DiscardAllSetting()
    $("#home").data("kendoWindow").open();
   
    $.ajax({
        type: "Get",
        url: "/api/LoadCalendar/BuildCalendar",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnBuildCalendarSuccess
    });

}

function OnBuildCalendarSuccess(data) {
   
    _currnetCalendar = data;
    FillForm();
}

function Save() {
    FillCurrent();
    var json = JSON.stringify(_currnetCalendar);
    $.ajax({
        type: "Post",
        url: "/api/LoadCalendar/SaveCalendar",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: json,
        success: function (data) {
            GetCalenderItems();
            Notify(data, "success");
            Close_WndEditAndAdd();
            DiscardAllSetting()
        }
    });
}


function UnCheckedCheckBox() {

    $("#Sa").prop("checked", false);
    $("#Su").prop("checked", false);
    $("#Mo").prop("checked", false);
    $("#Tu").prop("checked", false);
    $("#We").prop("checked", false);
    $("#Th").prop("checked", false);
    $("#Fr").prop("checked", false);
}

//----------------------------------------------------------اختصاص مدیر

function WNDAssignCalendar_OnInit() {
    $("#WNDAssignCalendar").data("kendoWindow").open();
}

function GetUsersCalendar() {
    $.ajax({
        type: "Get",
        url: "/api/LoadCalendar/GetAllUsers",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            
            _UsersCalendar = response
            DDLManager_OnInit();
            DDLCalendars_OnInit();
            Init_WNDAssign();
            Init_WNDhome();
            common.loaderHide();

        },
        error: function (e) {

        }
    });
}

function GetProjetsCalendar() {

        $.ajax({
            type: "Get",
            url: "/api/ProjectsAPI/GetAllProjects",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                _ProjectsCalendar = response;
                GRDProjectCalendar_OnInit();
                DDLProjects_OnInit();
                $("#GRDProjectCalendar").data("kendoGrid").dataSource.read();
            },
            error: function (e) {

            }
        });
    }

function DDLProjects_OnInit() {
    $("#DDLProjectsCalendar").kendoDropDownList({
        dataSource: {
            data: _ProjectsCalendar,
            schema: {
                model: {
                    id: "id"
                }
            }
        },
        dataTextField: "title",
        dataValueField: "id",
        filter: "contains",
        optionLabel: "انتخاب پروژه...",
        change: SelectProject
    });
}

function DDLCalendars_OnInit() {
    $("#DDLCalendar").kendoDropDownList({
        dataSource: {
            data: _calendars,
            schema: {
                model: {
                    id: "id"
                }
            }
        },
        dataTextField: "title",
        dataValueField: "id",
        filter: "contains",
        optionLabel: "انتخاب تقویم...",
        change: SelectCalendar
    });
}

function DDLManager_OnInit() {
    $("#DDLManager").kendoDropDownList({
        dataSource: {
            data: _UsersCalendar,
            schema: {
                model: {
                    id: "id"
                }
            }
        },
       
        dataTextField: "fullName" ,
        dataValueField: "id",
        filter: "contains",
        optionLabel: "انتخاب مدیر...",
        change: SelectManager
    });
}

function SelectProject() {
    SentAssignment.ProjectId =  $("#DDLProjectsCalendar").data("kendoDropDownList").value();
    $("#PNLCalendar").show(50);


}

function SelectCalendar() {
    SentAssignment.CalendarId = $("#DDLCalendar").data("kendoDropDownList").value();
    $("#PNLManager").show(50);
}

function SelectManager() {
    SentAssignment.UserId = $("#DDLManager").data("kendoDropDownList").value();
    $("#AssignButtons").show(50);
    
}

function WNDAssignCalendar_OnClose() {
    $("#WNDAssignCalendar").data("kendoWindow").close();
    ResetAssignForm();
}

function Assign() {
    var json = JSON.stringify(SentAssignment);
    $.ajax({
        type: "Post",
        url: "/api/LoadCalendar/AssignCalendarAndManager",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: json,
        success: function (data) {
          
GetCalenderItems();
            Notify(data, "success");
            ResetAssignForm();
            
        }
    });

}

function ResetAssignForm() {
    
    $("#PNLCalendar").hide(200);
    $("#AssignButtons").hide(200);
    $("#PNLManager").hide(200);
    $("#AssignButtons").hide(200);
    $("#PNLEditAssignHeader").text(" ");
    $("#PNLAssign").hide(200);
    $("#PNLGRDProjectCalendar").show(50);
    GetProjetsCalendar();
    DDLManager_OnInit();
    DDLCalendars_OnInit();
    DDLProjects_OnInit();
}

function GRDProjectCalendar_OnInit() {

    $("#GRDProjectCalendar").kendoGrid({
        dataSource: {
            transport: {
                read: function (e) {
                    e.success(_ProjectsCalendar);
                }
            },
            schema: {

                model: {
                    id: "id"
                },
                total: function (response) {
                    return response.length;
                }
            }
        },
        height: 500,
       
        //toolbar: "<a class='btn btn-info' id='home-tab'   onClick='btnAddClick()' >افزودن تقویم جدید</a> <a onClick='WNDAssignCalendar_OnInit()' class='btn btn-info'> تخصیص تقویم و مدیر به پروژه</a>",
        filterable: true,
        sortable: true,
        selectable: true,
        columns: [
            { field: "title", title: " پروژه", width: 150 },
            { field: "calendarTitle", title: "تقویم", width: 50 },
            { field: "ownerFullName", title: "مدیر", width: 50 },
            {
                title: "ویرایش ",
                template: "<button onclick='EditAssignment(this)' type='button' class='btn btn-warning btn-sm edit' name='info' title='ویرایش' > ویرایش</button>",
                headerTemplate: "<label class='text-center'> ویرایش </label>",
                filterable: false,
                sortable: false,
                width:40
            }

        ],
        pageable: {
            pageSize: 10,
            pageSizes: true
        }
    });
}

function EditAssignment(e) {
    var grid = $("#GRDProjectCalendar").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));
    SentAssignment.ProjectId =dataItem.id;
    
    $("#PNLEditAssignHeader").text( " پروژه "+ dataItem.title);
    $("#PNLAssign").show(50);
    $("#PNLGRDProjectCalendar").hide(50);
    $("#PNLCalendar").show(50);
}


function Close_WndEditAndAdd() {
    DiscardAllSetting()
    $("#home").data("kendoWindow").close()
}



function DiscardAllSetting() {
    UnCheckedCheckBox();
    _holidayList = [];
    $("#DDLCalendar").data("kendoDropDownList").select(0)
    $("#DDLManager").data("kendoDropDownList").select(0);
   
}

function adjustSize() {
    // For small screens, maximize the window when it is shown.
    // You can also make the check again in $(window).resize if you want to
    // but you will have to change the way to reference the widget and then
    // to use $("#theWindow").data("kendoWindow").
    // Alternatively, you may want to .center() the window.

    if ($(window).width() < 800 || $(window).height() < 600) {
        this.maximize();
    }
}



