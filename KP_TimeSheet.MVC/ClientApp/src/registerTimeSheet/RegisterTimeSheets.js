const common = require('../common/common');
const mainGrid = require('./mainGrid');
const priodlyGrid = require('./priodlyGrid');
const monthlyGrid = require('./monthlyGrid');
const data = require('./data');
const common_register = require('./common');
const period_next_pervious = require('./period_next_pervious');
const sended_workouts =require('./sended_workouts');

//_____ متغیر ها و Document Ready__________

$(document).ready(function () {
    mainGrid.GetTimeSheets(function(){
        priodlyGrid.InitPeriodlyByProjectsGrid();
        monthlyGrid.InitMonthlyByProjectsGrid();
        common.LoaderHide();
        period_next_pervious.init();
    });
});

$('input:radio[name="optperiod"]').change(function () {

    EnableAndDisableSendPeriodRadioButton(this);

});

$("#numberDays").keyup(function () {

    if ($("#numberDays").val() > 25) {
        $("#numberDays").val("25");
    }
});

//________________ جهت باز سازی TreeList اصلی



function RefreshTimeSheet() {
    $.ajax({
        type: "Get",
        url: "/api/TimeSheetsAPI/GetTimeSheets",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ktrlTimeSheets_OnRefresh,
        error: function (e) {

        }
    });
}


function ktrlTimeSheets_OnRefresh(response) {

    data.timeSheetData_set(response);
    common_register.removeAndRecreateTreelisDiv();
    mainGrid.Init_TimeSheetTreeList();
    //$("#ktrlTimeSheets").data("kendoTreeList").dataSource.read();
    common.LoaderHide();
}

//________________




//_______________ساختن TreeList اصلی






//____________________________________



//__________________________________________




// ________________ارسال تایم شیت

function wndSendWorkHour_OnClose() {
    $("#wndSendWorkHour").data("kendoWindow").close()
}

function GRDSendWorkHours_onInit(sendItem) {

    var ktrlTimeSheetsSend = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($("#" + sendItem.id).closest("tr"));
    _SelDate = ktrlTimeSheetsSend.values[parseInt($("#" + sendItem.id).attr('dayindex')) - 3];

    $("#SenddateTitle").text(_SelDate.PersianDate);

    var workHourJson = {
        ID: null,
        Date: _SelDate.Date,
    };
    var prmData = JSON.stringify(workHourJson);
    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetUnConfirmedWorkHours",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            _AllReadyForSent = 0
            for (var i = 0; i < response.length; i++) {
                _AllReadyForSent = _AllReadyForSent + response[i].Hours
            }
            $("#SumReadyForSentWorkHours").text(_AllReadyForSent);

            $.ajax({
                type: "Post",
                url: "/api/TimeSheetsAPI/GetPresenceHourByDate",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: prmData,
                success: function (response) {
                    _presenceHour = response.Hours

                    $("#presenceHour").text(_presenceHour);

                },
                error: function (e) {

                }
            });
            $.ajax({
                type: "Post",
                url: "/api/TimeSheetsAPI/GetConfirmedWorkHours",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: prmData,
                success: function (response) {
                    _AllSentCount = 0
                    for (var i = 0; i < response.length; i++) {
                        _AllSentCount = _AllSentCount + response[i].Hours
                    }
                    $("#SumSentWorkHours").text(_AllSentCount);
                    $("#GRDSendWorkHours").data("kendoGrid").dataSource.read();
                },
                error: function (e) {

                }
            });
            _SendWorkHourGrid = response;

            $("#GRDSendWorkHours").kendoGrid({
                dataSource: {
                    transport: {
                        read: function (e) {
                            e.success(_SendWorkHourGrid)
                        }
                    },
                    pageSize: 20
                },
                height: 400,
                pageable: true,
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
                    title: "ارسال ",
                    template: "<button   onclick='SendWorkHour_OnClick(this)' type='button' class='btn btn-success btn-sm' name='info' title='ارسال' > ارسال</button>",
                    headerTemplate: "<label class='text-center'> ارسال </label>",
                    filterable: false,
                    sortable: false,
                    width: 100
                },
                {
                    title: "حذف ",
                    template: "<button  onclick='DeleteWorkHourSendGrid(this)' type='button' class='btn btn-danger btn-sm' name='info' title='حذف' > حذف</button>",
                    headerTemplate: "<label class='text-center'> حذف </label>",
                    filterable: false,
                    sortable: false,
                    width: 100
                },
                ]

            });
        },
        error: function (e) {

        }
    });
}

function wndSendWorkHour_OnInit(SendWHsIdx) {

    _SendItem = SendWHsIdx
    var wndSendWorkHour = $("#wndSendWorkHour");
    wndSendWorkHour.kendoWindow({
        width: "750px",
        height: "670",

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

    GRDSendWorkHours_onInit(_SendItem);
}

function SendAllWorkHours_OnClick() {
    ;
    var ktrlTimeSheetsSend = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($("#" + _SendItem.id).closest("tr"));
    _SelDate = ktrlTimeSheetsSend.values[parseInt($("#" + _SendItem.id).attr('dayindex')) - 3];

    var workHourJson = {
        ID: null,
        Date: _SelDate.Date,
    };
    var prmData = JSON.stringify(workHourJson);
    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/SendWorkHours",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            _AllSentCount = 0

            for (var i = 0; i < response.length; i++) {
                _AllSentCount = _AllSentCount + response[i].Hours
            }
            $("#SumSentWorkHours").text(_AllSentCount);
            for (var i = 0; i < response.length; i++) {
                if (response[0] == "عملیات ارسال کارکرد ها با موفقیت انجام گردید") {
                    common.Notify(response[i], "success");
                } else {
                    common.Notify(response[i], "danger");
                }
            }

            wndSendWorkHour_OnClose();

        },
        error: function (e) {

        }
    });



    //kendo.confirm("  از ارسال ساعت کار خود در تاریخ" + _SelDate.title + " اطمینان دارید ").then(function () {

    //}, function () {

    //});


}

function SendWorkHour_OnClick(e) {

    var grid = $("#GRDSendWorkHours").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));


    var workHourJson = {
        ID: dataItem.ID,
        Date: _SelDate.Date,
    };

    var prmData = JSON.stringify(workHourJson);
    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/SendWorkHour",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function () {
            //wndSendWorkHour_OnClose();
            Refresh_GRDSendWorkHour();
            common.Notify("انجام عملیات  ارسال با موفقیت به انجام رسید.", "success");
        },
        error: function (e) {

        }
    });

}

function Refresh_GRDSendWorkHour() {
    var workHourJson = {
        ID: null,
        Date: _SelDate.Date,
    };

    var prmData = JSON.stringify(workHourJson);

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetUnConfirmedWorkHours",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            _AllReadyForSent = 0

            for (var i = 0; i < response.length; i++) {
                _AllReadyForSent = _AllReadyForSent + response[i].Hours
            }
            $("#SumReadyForSentWorkHours").text(_AllReadyForSent);
            $.ajax({
                type: "Post",
                url: "/api/TimeSheetsAPI/GetPresenceHourByDate",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: prmData,
                success: function (response) {
                    _presenceHour = response.Hour

                    $("#presenceHour").text(_presenceHour);

                },
                error: function (e) {

                }
            });
            $.ajax({
                type: "Post",
                url: "/api/TimeSheetsAPI/GetConfirmedWorkHours",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: prmData,
                success: function (response) {
                    _AllSentCount = 0
                    for (var i = 0; i < response.length; i++) {
                        _AllSentCount = _AllSentCount + response[i].Hours
                    }
                    $("#SumSentWorkHours").text(_AllSentCount);
                    $("#GRDSendWorkHours").data("kendoGrid").dataSource.read();
                },
                error: function (e) {

                }
            });
            _SendWorkHourGrid = response;
            $("#GRDSendWorkHours").data("kendoGrid").dataSource.read();
        },
        error: function (e) {

        }
    });






}

//_________________________


//____________ویرایش


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
            _WorkHours = response;
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
                    e.success(_WorkHours)
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



function exportTableToExcel(tableID, filename ){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}

//_________________________________________ناریخچه___________________________________

function Init_GRDHistory(e) {
    common.LoaderShow();
    
    var grid = $("#GrdMonitorSentWorkHour").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));
    var prmData = JSON.stringify(dataItem);
    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetHistoryWorkHour",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            
            _TodayHistorys = response;
            $("#WorkHourHistory").data("kendoGrid").dataSource.read();
            ShowHistory();
            common.LoaderHide();
        },
        error: function (e) {

        }
    });


}

function Create_GrdHistory() {

    $("#WorkHourHistory").kendoGrid({
        dataSource: {
            transport: {
                read: function (e) {
                    e.success(_TodayHistorys)
                }
            },
            pageSize: 10
        },
        height: 450,
        pageable: true,
        filterable: true,
        selectable: true,

        columns: [{
            field: "PersianDate",
            title: "تاریخ",
            width: 80
        },
        {
            field: "Time",
            title: "ساعت",
            width: 80
        },
        {
            field: "ManagerName",
            title: "نام مدیر",
            width: 200
        }, {
            field: "Action",
            title: "عملیات",
            width: 120
        }, {
            field: "StageTitle",
            title: "مرحله",
            width: 120

        }, {
            field: "Description",
            title: "توضیحات",
            width: 400

        }
        ]

    });
}

function ShowHistory() {

    $("#PanelMonitorWorkHour").fadeOut(400);
    $("#PanelHistory").fadeIn(400);


}

function HideHistory() {
    $("#PanelMonitorWorkHour").fadeIn(400);
    $("#PanelHistory").fadeOut(400);


}







//_____________________________________



function DeleteWorkHourSendGrid(e) {
    var grid = $("#GRDSendWorkHours").data("kendoGrid");
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
            Refresh_GRDSendWorkHour();
            RefreshTimeSheet();
            common.LoaderHide();
        },
        error: function (e) {
            alert(dataItem.ID);
        }
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
            monthlyGrid.Refresh_GrdEditWorkHour();

            RefreshTimeSheet();
            common.LoaderHide();
        },
        error: function (e) {
            alert(dataItem.ID);
        }
    });



}



/////----------------- ارسال دوره و تایید آن 

function btnSendPeriods_Onclick() {
    common.LoaderShow();
    kwndSelectPeriod_OnClose();


    if ($('#chkweekly').is(':checked')) {
        $.ajax({
            type: "Get",
            url: "/api/TimeSheetsAPI/ChangeDisplayPeriodToWeekly",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                data.timeSheetData_set(response);
                common_register.removeAndRecreateTreelisDiv();
                mainGrid.Init_TimeSheetTreeList();
                monthlyGrid.Refresh_GrdEditWorkHour();
                sended_workouts.Refresh_GrdMonitorSentWorkHour();
                common.LoaderHide();
            },
            error: function (e) {

            }
        });

    }
    else {
        var PeriodJson = {
            Date: $("#startDate").val(),
            Days: $("#numberDays").val(),
            IsWeekly: false
        };

        var prmData = JSON.stringify(PeriodJson);

        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetTimeSheetsByDateAndNumberOfDay",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: function (response) {
                data.timeSheetData_set(response);
                common_register.removeAndRecreateTreelisDiv();
                mainGrid.Init_TimeSheetTreeList();
                common.LoaderHide();
            },
            error: function (e) {

            }
        });
    }

}





function EnableAndDisableSendPeriodRadioButton() {
    if ($("#numberDays").is(':disabled')) {

        $("#numberDays").prop("disabled", false);
        $("#startDate").prop("disabled", false);

    } else {
        $("#numberDays").prop("disabled", true);
        $("#startDate").prop("disabled", true);
    }

}

