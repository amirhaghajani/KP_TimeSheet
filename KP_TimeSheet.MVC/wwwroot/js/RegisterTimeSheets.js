(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
    'LoaderShow': function () {
        $("#Loader").fadeIn(500);
    },
    'LoaderHide':function(){
        $("#Loader").fadeOut(500);
    },'Notify':function(messege, type) {
   
    
        $.notify({
            //icon: 'glyphicon glyphicon-warning-sign',
            //title: 'Bootstrap notify',
            message:"<strong >"+ messege +"</strong>",
            //url: 'https://github.com/mouse0270/bootstrap-notify',
            //target: '_blank'
        }, {
                // settings
                //element: 'body',
                //position: null,
                type: type,
                allow_dismiss: false,
                //newest_on_top: false,
                //showProgressbar: true,
                placement: {
                    from: "top",
                    align: "left"
                },
                offset: 20,
                spacing: 10,
                z_index: 10100,
                delay: 1000,
                timer: 1000,
                //url_target: '_blank',
                //mouse_over: null,
                animate: {
                    enter: 'animated fadeInDown',
                   exit: 'animated fadeOutUp'
               },
                //onShow: null,
                //onShown: null,
                //onClose: null,
                //onClosed: null,
                //icon_type: 'class',
               // template: "<div style='height:15px;width:20%' class='shadow' >" + messege + "</div>"
            });
    }
};

},{}],2:[function(require,module,exports){
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


},{"../common/common":1,"./common":3,"./data":4,"./mainGrid":5,"./monthlyGrid":6,"./period_next_pervious":7,"./priodlyGrid":8,"./sended_workouts":10}],3:[function(require,module,exports){
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

function removeAndRecreateTreelisDiv() {
    $("#ktrlTimeSheets").data("kendoTreeList").destroy();
    $("#ktrlTimeSheets").remove();
    $("#KTLContainer").append("<div id='ktrlTimeSheets'></div>");
}

module.exports={
    'adjustSize': adjustSize,
    'removeAndRecreateTreelisDiv':removeAndRecreateTreelisDiv
}
},{}],4:[function(require,module,exports){
var _SelDate;
var CurrentUser;
var _TimeSheetData = [];
var _WorkHourOnProjects = [];
var _thisMonthdata = {};
var _WorkHours = [];
var _SendItem = {};
var _SendWorkHourGrid = [];
var _thisPerioddata = [];
var _MonitorSentWorkHours = [];
var _AllSentCount = 0;
var _AllReadyForSent = 0;
var _presenceHour = 0;
var _TodayHistorys = [];

module.exports={
    'selDate_get':()=> this._SelDate,
    'selDate_set':(data)=> this._SelDate = data,

    'timeSheetData_get':()=> this._TimeSheetData,
    'timeSheetData_set':(data)=> this._TimeSheetData = data,

}
},{}],5:[function(require,module,exports){
const data=require('./data');
const saveWindow=require('./saveWindow');

function KTRColumn() {
  this.field = "";
  this.title = "";
  this.template = "";
  this.hidden = false;
  this.width = 40;
  this.headerTemplate = "";
  this.filterable = false;
};

function GetTimeSheets(callBackFn) {

  $.ajax({
    type: "Get",
    url: "/api/TimeSheetsAPI/GetTimeSheets",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: (response)=> ktrlTimeSheets_OnInit(response , callBackFn),
    error: function (e) {

    }
  });
}

function ktrlTimeSheets_OnInit(response, callBackFn) {

  data.timeSheetData_set(response);
  Init_TimeSheetTreeList();

  if(callBackFn) callBackFn();
  
}

function Init_TimeSheetTreeList() {
  var ktrlTSColumns = ktrlTimeSheets_OnInitColumns(data.timeSheetData_get());

  $("#ktrlTimeSheets").kendoTreeList({
    dataSource: {
      transport: {
        read: function (e) {
          e.success(data.timeSheetData_get());
        },
      }
    },
    schema: {
      model: {
        id: "id",
        parentId: "parentId"
      }
    },
    height: 400,
    columns: ktrlTSColumns,
    scrollable: true,
    selectable: true,
    dataBound: ktrlTimeSheets_DataBound
  });

  $("#ktrlTimeSheets").kendoTooltip({
    filter: 'td',
    content: function (e) {

      var treelist = $("#ktrlTimeSheets").data("kendoTreeList");
      var targetRow = $(e.target).closest('tr');
      var dataItem = treelist.dataItem(targetRow);
      return dataItem.title;
    }
  });
  $("#ktrlTimeSheets tbody").on("dblclick", "td", function (e) {
    var cell = $(e.currentTarget);
    var cellIndex = cell[0].cellIndex;
    var grid = $("#ktrlTimeSheets").data("kendoTreeList");
    var column = grid.columns[cellIndex];
    var dataItem = grid.dataItem(cell.closest("tr"));
    alert("Satr: " + dataItem.title + " - Sotoon: " + dataItem.values[cellIndex - 3].title);
  });



}

function ktrlTimeSheets_OnInitColumns(response) {
  var x = JSON.stringify(response);
  var columns = [];
  var colId = new KTRColumn();
  colId.field = "id";
  colId.title = "شناسه";
  colId.hidden = true;
  colId.width = 10;
  columns.push(colId);

  var colParentId = new KTRColumn();
  colParentId.field = "parentId";
  colParentId.title = "شناسه پدر";
  colParentId.hidden = true;
  colParentId.width = 10;
  columns.push(colParentId);

  var colTitle = new KTRColumn();

  colTitle.field = "title";
  colTitle.title = "عنوان";
  colTitle.hidden = false,

    colTitle.width = 150;
  columns.push(colTitle);

  for (var i = 0; i < response[0].values.length; i++) {

    var tsDate = response[0].values[i];
    var colDate = new KTRColumn();
    colDate.field = "values[" + i + "].value";
    colDate.format = "";
    colDate.title = tsDate.title;
    colDate.headerTemplate = "<h6> <b>" + tsDate.persianDate + "</b></h6>  <h6>" + tsDate.persianDay + "</h6>";
    colDate.hidden = false;
    colDate.width = 50;
    columns.push(colDate);
  }
  return columns;
}

function ktrlTimeSheets_DataBound(e) {

  var grid = this;
  var dataSource = grid.dataSource;
  //Loop through each record in a Kendo Grid
  $.each(grid.items(), function (index, item) {

    var tsRow = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($(item).closest("tr"));
    if (tsRow.title === "عملیات") {

      $.each(item.children, function (childIdx, childElm) {
        var emlId = 'SaveWorkHours' + childIdx;
        var semlId = 'SendWorkHours' + childIdx;
        var sendId = 'ShowSent' + childIdx;

        if (childElm.innerText == "True True") {

          childElm.innerHTML = "<button title='ثبت ساعت کارکرد' id='" + emlId +
            "' class='btn btn-success btn-xs' style='width:10px;height:15px'" +
            " onclick='kwndSaveWHs_OnInit(\"" + emlId + "\")' dayIndex='" + childIdx + "' >+</button>";


          childElm.innerHTML = childElm.innerHTML + "<button title='ارسال ساعت کارکرد' id='" +
            semlId + "'  class='btn btn-warning btn-xs' style='width:10px;height:15px;margin-right:10px;'" +
            " onclick='wndSendWorkHour_OnInit(" + semlId + ")' dayIndex='" + childIdx + "' ><b>↑</b></button>";

          childElm.innerHTML = childElm.innerHTML + "<button title='نمایش کارکردهای این روز' id='" +
            sendId + "'  class='btn btn-info btn-xs' style='width:10px;height:15px;margin-right:10px;'" +
            " onclick='ShowCurrentDaySendWorkHours(" + sendId + ")' dayIndex='" +
            childIdx + "' ><i class='fa fa-tv'></i></button>";


        }

        if (childElm.innerText == "False False") {
          childElm.innerHTML = "<label title=' ' class='text-warning' ><i class='glyphicon glyphicon-ban-circle'></i> </label>"
        }

        if (childElm.innerText == "True False") {
          var emlId = 'SaveWorkHours' + childIdx;
          childElm.innerHTML = `<button title='ثبت ساعت کارکرد' id='${emlId}' 
                        class='btn btn-success btn-xs forFound_kwndSaveWHs_OnInit' style='width:10px;height:15px'
                         dayIndex='${childIdx}' data-eml-id='${emlId}'>+</button>`;

          childElm.innerHTML = childElm.innerHTML + `<button title='نمایش کارکردهای این روز' id='${sendId}'  
            class='btn btn-info btn-xs forFound_ShowCurrentDaySendWorkHours' style='width:10px;height:15px;margin-right:10px;' 
              data-send-id='"${sendId}"' dayIndex='${childIdx}' ><i class='fa fa-tv'></i></button>`;
        }


      });
    }
  });

  $('.forFound_kwndSaveWHs_OnInit').off().on('click', function () {
    var id = $(this).data("emlId");
    saveWindow.kwndSaveWHs_OnInit(id);
  });

  $('.forFound_ShowCurrentDaySendWorkHours').off().on('click',function(){
    var sendId = $(this).data("sendId");
    howCurrentDaySendWorkHours(sendId);
  });

}

module.exports = {

  'GetTimeSheets': GetTimeSheets,
  'Init_TimeSheetTreeList': Init_TimeSheetTreeList

};
},{"./data":4,"./saveWindow":9}],6:[function(require,module,exports){
const data = require('./data');

//___________جدول پایین صفحه ماهانه

function InitMonthlyByProjectsGrid() {
    var prmData = JSON.stringify(data.timeSheetData_get()[0].values[0]);
    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetThisMonthData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            _thisMonthdata = response;
            $("#MonthlyPresence").text(response.Presence);
            $("#MonthlyWorkHour").text(response.Work);
            $("#MonthlyDefference").text(response.Defference);
            $("#MonthlyPresencePercent").width(response.Presencepercent);
            $("#MonthlyWorkHourPercent").width(response.Workpercent);
            $("#MonthlyDefferencePercent").width(response.Defferencepercent);
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
            field: "Title",
            title: "عنوان پروژه"
        }, {
            field: "Hour",
            title: "ساعت کار ثبت شده    "
        }]
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
            _WorkHours = response;
            var g = $("#GrdEditWorkHour").data("kendoGrid");
            if(g) g.dataSource.read();
        },
        error: function (e) {
        }
    });
}

module.exports ={
    'InitMonthlyByProjectsGrid':InitMonthlyByProjectsGrid,
    'Refresh_GrdEditWorkHour':Refresh_GrdEditWorkHour
}
},{"./data":4}],7:[function(require,module,exports){
const common_register = require('./common');
const common = require('../common/common');
const data = require('./data');
const mainGrid = require('./mainGrid');
const monthlyGrid = require('./monthlyGrid');
const sended_workouts =require('./sended_workouts');
const priodlyGrid = require('./priodlyGrid');

//_________صفحه بعد و قبل 
function init(){
    $('#btnpreviousPeriod').off().on('click',function(){
        GetPreviousPeriod();
    });

    $('#btnSelectPeriod').off().on('click',function(){
        kwndSelectPeriod_OnInit();
    });

    $('#btnNextPeriod').off().on('click',function(){
        GetNextPeriod();
    });
}

function GetNextPeriod() {
    common.LoaderShow();

    var prmData = JSON.stringify(data.timeSheetData_get()[0].values[data.timeSheetData_get()[0].values.length - 1]);

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetNextPeriod",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            data.timeSheetData_set(response);
            common_register.removeAndRecreateTreelisDiv();
            mainGrid.Init_TimeSheetTreeList();
            monthlyGrid.Refresh_GrdEditWorkHour();
            sended_workouts.Refresh_GrdMonitorSentWorkHour();
            priodlyGrid.InitPeriodlyByProjectsGrid();
            monthlyGrid.InitMonthlyByProjectsGrid();
            common.LoaderHide();
        },
        error: function (e) {

        }
    });
}

function GetPreviousPeriod() {
    common.LoaderShow();

    var prmData = JSON.stringify(data.timeSheetData_get()[0].values[0]);

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetPreviousPeriod",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {

            data.timeSheetData_set(response);
            common_register.removeAndRecreateTreelisDiv();
            mainGrid.Init_TimeSheetTreeList();
            monthlyGrid.Refresh_GrdEditWorkHour();
            sended_workouts.Refresh_GrdMonitorSentWorkHour();
            priodlyGrid.InitPeriodlyByProjectsGrid();
            monthlyGrid.InitMonthlyByProjectsGrid();

            common.LoaderHide();

        },
        error: function (e) {

        }
    });




}

function GetCurrentPeriod() {
    common.LoaderShow();
    var prmData = JSON.stringify(data.timeSheetData_get()[0].values);

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/GetCurrentPeriod",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            data.timeSheetData_set(response);
            common_register.removeAndRecreateTreelisDiv();
            mainGrid.Init_TimeSheetTreeList();
            monthlyGrid.Refresh_GrdEditWorkHour();
            sended_workouts.Refresh_GrdMonitorSentWorkHour();
            priodlyGrid.InitPeriodlyByProjectsGrid();
            monthlyGrid.InitMonthlyByProjectsGrid();
            common.LoaderHide();
        },
        error: function (e) {

        }
    });
}



function kwndSelectPeriod_OnInit() {

    var kwndSendWHs = $("#kwndSelectTimePeriod");
    kwndSendWHs.kendoWindow({
        width: "600px",
        height: "290px",
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

function kwndSelectPeriod_OnClose() {
    $("#kwndSelectTimePeriod").data("kendoWindow").close()
}


module.exports={
    "init":init
}
},{"../common/common":1,"./common":3,"./data":4,"./mainGrid":5,"./monthlyGrid":6,"./priodlyGrid":8,"./sended_workouts":10}],8:[function(require,module,exports){
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
},{"./data":4}],9:[function(require,module,exports){
const common = require('../common/common');
const common_register = require('./common');


//_____________________پنجره ذخیره

function kwndSaveWHs_OnInit(SaveWHsIdx) {

    $('#btnCancel_kwndSaveWHs').off().on('click',function(){
        kwndSaveWHs_OnClose();
    });
    $('#btnSaveWorkHours_kwndSaveWHs').off().on('click',function(){
        btnSaveWorkHours_Onclick();
    });

    var ktrlTimeSheets = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($("#" + SaveWHsIdx).closest("tr"));
    _SelDate = ktrlTimeSheets.values[parseInt($("#" + SaveWHsIdx).attr('dayindex')) - 3];
    GetProjects();
}

function kwndSaveWHs_OnClose() {
    var w= $("#kwndSaveWorkHours").data("kendoWindow");
    if(w) w.close();
}

function GetProjects() {
    $.ajax({
        type: "Get",
        url: "/api/ProjectsAPI/GetProjects",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ddlProjects_OnInit,
        error: function (e) {

        }
    });
}

function ddlProjects_OnInit(response) {

    if (response.length == 0 ) {
        common.Notify("کاربر گرامی شما فاقد پروژه میباشید", "danger");
        kwndSaveWHs_OnClose();
        return
    } else {

        $("#ddlProjects").kendoDropDownList({
            dataSource: {
                data: response,
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
            change: GetTasks
        });
        $("#ktpWorkHour").kendoTimePicker({
            format: "HH:mm"
        });
        var kwndSaveWHs = $("#kwndSaveWorkHours");
        kwndSaveWHs.kendoWindow({
            width: "500px",
            height: "640px",

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
            close: ResetSaveWindow
        }).data("kendoWindow").center().open();
    }
}

function GetTasks() {

    var projID = $("#ddlProjects").data("kendoDropDownList").value();
    var prmData = { id: projID };
    $.ajax({
        type: "Get",
        url: "/api/ProjectsAPI/GetTasks",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: ddlTasks_OnInit,
        error: function (e) {

        }
    });
}

function ddlTasks_OnInit(response) {
debugger;
    $("#ddlTasks").kendoDropDownList({
        dataSource: {
            data: response,
            schema: {
                model: {
                    id: "id"
                }
            }
        },
        dataTextField: "title",
        dataValueField: "id",
        filter: "contains",
        optionLabel: "انتخاب فعالیت...",
        //change: GetTasks
    });
    $("#TaskPanel").show(100);
    $("#TimeSpanPanel").show(100);

}

function btnSaveWorkHours_Onclick() {
    
    $("span[for='ktpWorkHour']").text("");
    $("span[for='ddlTasks']").text("");

    var workHourJson = {
        ID: null,
        Date: _SelDate.Date,
        EmployeeID: '',
        TaskID: $("#ddlTasks").data("kendoDropDownList").value(),
        Hours: $("#ktpWorkHour").data("kendoTimePicker")._oldText,
        ProjectID: $("#ddlProjects").data("kendoDropDownList").value(),
        Description: $("#txtDescription").val()
    };

    if (!workHourJson.TaskID) {
        $("span[for='ddlTasks']").text("وظیفه ضروری است");
        return;
    }

    if (!workHourJson.Hours) {
        $("#ktpWorkHour").val("");
        $("span[for='ktpWorkHour']").text("ساعت ضروری است");
        return;
    }

    common.LoaderShow();

    kwndSaveWHs_OnClose();
    var prmData = JSON.stringify(workHourJson);

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/SaveWorkHours",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: SaveWorkHours_OnSuccess,
        error: function (e) {

        }
    });
}

function SaveWorkHours_OnSuccess(response) {

    GetCurrentPeriod();
    kwndSaveWHs_OnClose();
    if(response.lenth > 0){
        for (var i = 0; i < response.length; i++) {
            common.Notify(response[i], "danger");
        } 
    }
    else {
        common.Notify("ثبت کاکرد با موفقیت انجام شد", "success");
    }
}

function ResetSaveWindow() {
    var item = $("#ddlProjects").data("kendoDropDownList");
    if (item && item.select) item.select(0);

    item = $("#ddlTasks").data("kendoDropDownList");
    if (item && item.select) item.select(0);

    $("span[for='ktpWorkHour']").text("");
    $("span[for='ddlTasks']").text("");

    $("#ktpWorkHour").val("");

    $("#txtDescription").val(""); 
    $("#TaskPanel").hide();
}


module.exports={
    'kwndSaveWHs_OnInit':kwndSaveWHs_OnInit
}
},{"../common/common":1,"./common":3}],10:[function(require,module,exports){
const data = require('./data');

//______________________نمایش کارکرد های ارسال شده


function Close_WndMonitorSentWorkHours() {
	$("#WndMonitorSentWorkHours").data("kendoWindow").close()
}

function Open_WndMonitorSentWorkHours() {
	$("#WndMonitorSentWorkHours").data("kendoWindow").open()
}

function GetWorkHours_MonitorSentWorkHour() {


	var prmData = JSON.stringify(data.timeSheetData_get()[0].values);

	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/GetCurrentPeriodSentWorkHours",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,
		success: function (response) {

			_MonitorSentWorkHours = response;
			Init_GrdMonitorSentWorkHour();
		},
		error: function (e) {

		}
	});
}

function Init_GrdMonitorSentWorkHour() {

	Create_GrdHistory();
	HideHistory();
	$("#WndMonitorSentWorkHours").kendoWindow({
		width: "1000px",
		height: "600px",
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

	$("#GrdMonitorSentWorkHour").kendoGrid({
		dataSource: {
			transport: {
				read: function (e) {
					e.success(_MonitorSentWorkHours)
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
			title: "ساعت کار",
			width: 80

		}, {
			field: "WorkFlowStageTitle",
			title: "عنوان مرحله",
			width: 200
		}
			, {
			title: "نمایش تاریخچه   ",
			template: "<button   onclick='Init_GRDHistory(this)' type='button' class='btn btn-primary btn-sm' name='info' title='نمایش تاریخچه' > نمایش تاریخچه</button>",
			headerTemplate: "<label class='text-center'> نمایش تاریخچه </label>",
			filterable: false,
			sortable: false,
			width: 100
		}
		]

	});
}

function Refresh_GrdMonitorSentWorkHour() {
	var prmData = JSON.stringify(data.timeSheetData_get()[0].values);
	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/GetRegistereCurrentPerioddWorkHours",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,
		success: function (response) {
			_MonitorSentWorkHours = response;
			var g = $("#GrdMonitorSentWorkHour").data("kendoGrid");

			if (g) g.dataSource.read();
		},
		error: function (e) {
		}
	});
}

function ShowCurrentDaySendWorkHours(SaveWHsIdx) {
	common.LoaderShow();
	Create_GrdHistory();

	var ktrlTimeSheets = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($("#" + SaveWHsIdx.id).closest("tr"));
	_SelDate = ktrlTimeSheets.values[parseInt($("#" + SaveWHsIdx.id).attr('dayindex')) - 3];

	var workHourJson = {
		ID: null,
		Date: _SelDate.Date
	}

	var prmData = JSON.stringify(workHourJson);

	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/GetWorkHoursByDate",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,
		success: function (response) {

			_MonitorSentWorkHours = response;
			Init_GrdMonitorSentWorkHour();
			$("#GrdMonitorSentWorkHour").data("kendoGrid").dataSource.read();
			Open_WndMonitorSentWorkHours();

			common.LoaderHide();
		},
		error: function (e) {

		}
	});


}

module.exports = {
	'Refresh_GrdMonitorSentWorkHour': Refresh_GrdMonitorSentWorkHour,
	'Init_GrdMonitorSentWorkHour': Init_GrdMonitorSentWorkHour
}

},{"./data":4}]},{},[2]);
