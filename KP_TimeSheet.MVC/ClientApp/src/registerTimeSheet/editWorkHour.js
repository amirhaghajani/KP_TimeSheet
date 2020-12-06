const data = require('./data');
const common_register = require('./common');

//____________ویرایش

function init(){
    $('#btnEditWorkHour').off().on('click',function(){
        WndEditWorkHours_OnInit();
    });

    $('#btn_Close_WndEditWorkHours').off().on('click',function(){
        Close_WndEditWorkHours();
    });

}

function WndEditWorkHours_OnInit() {
    GetWorkHours_GrdEditWorkHour();

    var kwndSaveWHs = $("#WndEditWorkHours");
    kwndSaveWHs.kendoWindow({
        width: "900px",
        height: "650",

        scrollable: false,
        visible: false,
        modal: true,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
        open: common_register.adjustSize,
    }).data("kendoWindow").center().open();
}

function Close_WndEditWorkHours() {
    $("#WndEditWorkHours").data("kendoWindow").close()
}

function GetWorkHours_GrdEditWorkHour() {

    var prmData = JSON.stringify(data.timeSheetData_get()[0].values);

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetRegistereCurrentPerioddWorkHours",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            data.workHours_set(response);
            Init_GrdEditWorkHour();
        },
        error: function (e) {

        }
    });
}

function Init_GrdEditWorkHour() {

    $("#GrdEditWorkHour").kendoGrid({
        dataSource: {
            transport: {
                read: function (e) {
                    e.success(data.workHours_get())
                }
            },
            pageSize: 10
        },
        height: 520,
        pageable: true,
        filterable: true,

        selectable: true,

        columns: [{
            field: "PersianDate",
            title: "تاریخ"
        },
        {
            field: "ProjectTitle",
            title: "پروژه"
        }, {
            field: "TaskTitle",
            title: "وظیفه"
        }, {
            field: "Hours",
            title: "ساعت کار ثبت شده    "
        },


        {
            title: "حذف ",
            template: "<button  onclick='DeleteWorkHourEditGrid(this)' type='button' class='btn btn-danger btn-sm' name='info' title='حذف' > حذف</button>",
            headerTemplate: "<label class='text-center'> حذف </label>",
            filterable: false,
            sortable: false,
            width: 100
        },
        ]

    });
}

function DeleteWorkHourEditGrid(e) {

    var grid = $("#GrdEditWorkHour").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));


    common.LoaderShow();


    var prmData = JSON.stringify(dataItem);

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/DeleteWorkHours",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            editWindow.Refresh_GrdEditWorkHour();

            RefreshTimeSheet();
            common.LoaderHide();
        },
        error: function (e) {
            alert(dataItem.ID);
        }
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
            data.workHours_set(response);
            var g = $("#GrdEditWorkHour").data("kendoGrid");
            if(g) g.dataSource.read();
        },
        error: function (e) {
        }
    });
}

module.exports={
    'WndEditWorkHours_OnInit':WndEditWorkHours_OnInit,
    'init':init,
    'Refresh_GrdEditWorkHour':Refresh_GrdEditWorkHour
}