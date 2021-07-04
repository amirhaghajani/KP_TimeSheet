const common = require('../common/common');
const service = require('./service');
const dataService = require('./data');
const common_timeSheet = require('../common/timesheet');
const approveWindow = require('./approveWindow');

const history_sentWorkHour = require('../registerTimeSheet/history_sentWorkHour');

let fnlastRefreshCommand=RefreshTimeSheetConfirm;
let expandedRows = [];


function KTRColumnConfirm() {
  this.field = "";
  this.title = "";
  this.template = "";
  this.hidden = false;
  this.width = 40;
  this.headerTemplate = "";
  this.filterable = false;
}

$(document).ready(function () {

  dataService.init();
  service.init(dataService, common_timeSheet, common);
  approveWindow.init(common, service, dataService,()=>{ fnlastRefreshCommand() });


  GetUsers();

  $('#btnRefreshSubUsers').off().on('click', function () {
    GetUsers();
  });

  $('#btnpreviousPeriodconfirm').off().on('click', function () {
    GetPreviousNextPeriodconfirm('previous');
  });
  $('#btnSelectPeriodconfirm').off().on('click', function () {
    WNDSelectPeriod_OnOpen();
  });
  $('#btnNextPeriodconfirm').off().on('click', function () {
    GetPreviousNextPeriodconfirm('next');
  });


  $('#btnSendPeriodconfirm').off().on('click', function () {
    btnSendPeriodsconfirm_Onclick();
  });
  $('#btnCancelconfirm').off().on('click', function () {
    WNDSelectPeriod_OnClose();
  });

  $('#btnDeny').off().on('click', function () {
    FinalDeny();
  });
  $('#btnDiscardDeny').off().on('click', function () {
    WndDeny_OnClose();
  });

});

$('input:radio[name="optradioconfirm"]').change(function () {
  EnableAndDisableSendPeriodRadioButtonConfirm(this);
});

$("#numberDaysconfirm").keyup(function () {

  if ($("#numberDaysconfirm").val() > 25) {
    $("#numberDaysconfirm").val("25");
  }
});


function WNDSelectPeriod_OnOpen() {
  common.openWindow('kwndSelectTimePeriodConfirm');
}

function WNDSelectPeriod_OnClose() {
  $("#kwndSelectTimePeriodConfirm").data("kendoWindow").close();
}



function RefreshTimeSheetConfirm() {
  common.loaderShow();

  service.getTimeSheetsByUserIdForFirstTime((response) => {

    private_Refresh(response);

  });

}

function private_Refresh(response) {

  $("#ExportNavConfirm").show();

  var treeList = $("#ktrlTimeSheetsConfirm").data("kendoTreeList");
  expandedRows = common_timeSheet.foundExpandedTreeListTitle(treeList);

  removeAndRecreateTreelisConfirmDiv();

  Init_TimeSheetTreeListConfirm(response);
  InitMonthlyByProjectsGridConfirm();
  InitPeriodlyByProjectsGridConfirm();
  $("#DownSideTabsConfirm").show();
  $("#PeriodPanle").show();
  
  common.loaderHide();
}

function removeAndRecreateTreelisConfirmDiv() {

  if (!$("#ktrlTimeSheetsConfirm").data("kendoTreeList")) return;
  $("#ktrlTimeSheetsConfirm").data("kendoTreeList").destroy();
  $("#ktrlTimeSheetsConfirm").remove();
  $("#KTLContainerRegisterConfirm").append("<div id='ktrlTimeSheetsConfirm'></div>");
}
function GetUsers() {

  service.getSubUsersForApprove((response) => {
    $("#kddlUsers").kendoDropDownList({
      dataTextField: "fullName",
      dataValueField: "id",
      filter: "contains",
      optionLabel: {
        fullName: "انتخاب کاربر . . . ",
        id: ""
      },
      dataSource: {
        transport: {
          read: function (e) {
            e.success(dataService.users_get());
          }
        }
      },
      index: 0,
      change: kddlUsers_OnChange
    });
  });
}

function kddlUsers_OnChange(e) {

  common.loaderShow();
  dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);

  if (dataService.userId_get() != "") {

    RefreshTimeSheetConfirm();

  } else {
    common.loaderHide();
    common.notify("کاربری انتخاب نشده ", "warning");
  }

}

function Init_TimeSheetTreeListConfirm(data) {

  var ktrlTSColumnsConfirm = ktrlTimeSheetsConfirm_OnInitColumns(data);
  var timeSheetData = data.slice(1);

  $("#ktrlTimeSheetsConfirm").kendoTreeList({
    dataSource: {
      transport: {
        read: function (e) {
          e.success(timeSheetData);
        },
      }
    },
    schema: {
      model: {
        id: "id",
        parentId: "parentId"
      }
    },
    expanded: true,
    selectable: true,
    scrollable: true,
    height: common.getAvailabelSpace("ktrlTimeSheetsConfirm"),
    columns: ktrlTSColumnsConfirm,
    dataBound: ktrlTimeSheetsConfirm_dataBound
  });


  $("#ktrlTimeSheetsConfirm tbody").off().on("dblclick", "td", function (e) {

    var cell = $(e.currentTarget);
    var cellIndex = cell[0].cellIndex;
    var grid = $("#ktrlTimeSheetsConfirm").data("kendoTreeList");
    var column = grid.columns[cellIndex];
    var dataItem = grid.dataItem(cell.closest("tr"));


    if (dataItem.type != 'Karkard' && dataItem.type != 'Project' && dataItem.type != 'Workout') return;

    if (cellIndex<3 || !dataItem.values) return;
    var sotoon = dataItem.values[cellIndex - 3];

    var timeSheetData = dataService.timeSheetDataConfirm_get();
    var dayTime = timeSheetData[0].values[cellIndex - 3];
    //moduleData.data.selDate_set(dayTime);


    if (dataItem.type == 'Workout') {

      const items = [];
      const item = {};
      const taskId = dataItem.uuiidd;

      var parent = grid.dataSource.parentNode(dataItem);
      var projectId = parent.uuiidd;
      item.projectTitle = parent.title;

      if (sotoon.value.indexOf('0:00') == 0) {
        //moduleData.createNewWorkHour.kwndSaveWHs_OnInit_ForEdit(dayTime, projectId, taskId, null);
        return;
      } else {

        $.ajax({
          type: "Post",
          url: "/api/TimeSheetsAPI/GetWorkHoursByDate",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          data: JSON.stringify({ date: sotoon.date, taskId: taskId, userId: dataService.userId_get() }),
          success: function (response) {

              for (var k in response) {
                const item = response[k];
                item.time = common_timeSheet.convertMinutsToTime(item.minutes);
              }
              ShowKarkar(response, 'کارکردهای '+ dataItem.title + ' در ' + sotoon.persianDate);

          },
          error: function (e) {
            var a = e;
          }
        });

      }
      return;
    }

    // if (dataItem.type == 'Project') {

    //   $.ajax({
    //     type: "Post",
    //     url: "/api/TimeSheetsAPI/GetWorkHoursByDate",
    //     contentType: "application/json; charset=utf-8",
    //     dataType: "json",
    //     data: JSON.stringify({ date: sotoon.date, projectId: dataItem.uuiidd }),
    //     success: function (response) {

    //       for (var k in response) {
    //         const item = response[k];
    //         item.time = moduleData.common_timeSheet.convertMinutsToTime(item.minutes);
    //       }
          
    //       moduleData.history_sentWorkHour.ShowDataOnGrid(response, 'کارکردهای ' + dataItem.title + ' در ' + sotoon.persianDate);

    //     },
    //     error: function (e) {
    //       var a = e;
    //     }
    //   });

    //   return;
    // }

    // if (dataItem.type == 'Karkard') {
    //   moduleData.history_sentWorkHour.ShowCurrentDaySendWorkHours(dayTime, 'کارکردها در ' + sotoon.persianDate);
    //   return;
    // }

    //alert("Satr: " + dataItem.title + " - Sotoon: " + dataItem.values[cellIndex - 3].title + " - type: "+dataItem.type);
  });

}

function ShowKarkar(data, headerTitle) {
  if(headerTitle) $('#headerText_Karkard').text(headerTitle);
  _Init_GrdMonitorSentWorkHour(data);
}

function _Init_GrdMonitorSentWorkHour(data) {

  $('#GrdMonitorSentWorkHour_Hide').off().on('click', function () {
    $("#WndMonitorSentWorkHours").data("kendoWindow").close();
  });

  common.openWindow('WndMonitorSentWorkHours');

  $("#GrdMonitorSentWorkHour").kendoGrid({
    dataSource: {
      transport: {
        read: function (e) {
          e.success(data);
        }
      },
      pageSize: 10
    },
    height: 450,
    pageable: true,
    filterable: true,
    selectable: true,

    columns: [
      {
      field: "persianDate",
      title: "تاریخ",
      width: 90
    },
    {
      field: "projectTitle",
      title: "پروژه",
      width: 150
    }, {
      field: "taskTitle",
      title: "وظیفه",
      width: 150
    }, {
      field: "time",
      title: "مدت",
      width: 60

    }, {
      field: "workFlowStageTitle",
      title: "مرحله",
      width: 90
    },
    {
      field: "description",
      title: "توضیحات",
      width: 200
    }

    ]

  });


}

function ktrlTimeSheetsConfirm_OnInitColumns(response) {

  var columns = [];

  var colId = new KTRColumn();
  colId.field = "id";
  colId.title = "شناسه";
  colId.hidden = true;
  colId.width = 10;
  columns.push(colId);

  var colParentId = new KTRColumnConfirm();
  colParentId.field = "parentId";
  colParentId.title = "شناسه پدر";
  colParentId.hidden = true;
  colParentId.width = 10;
  columns.push(colParentId);

  var colTitle = new KTRColumnConfirm();

  //colTitle.field = "title";
  colTitle.title = "عنوان";
  colTitle.hidden = false;
  colTitle.width = 240;
  colTitle.template = (data) => {

    if (data.has_NotApproveData) {
      const color = data.type == '-' ? 'style="color:#FAFAF2"' : (data.type.startsWith('Project_') ? 'style="color:#E5F0FF"' : 'style="color:#CEFF9D"');
      const bc = data.type == '-' ? ';background-color:#FAFAF2' : (data.type.startsWith('Project_') ? ';background-color:#E5F0FF' : ';background-color:#CEFF9D');
      const title = data.type == '-' ? `همه کارکردهای تایید نشده` : (data.type.startsWith('Project_') ? `همه کارکردهای تایید نشده پروژه ${data.title}` : `همه کارکردهای تایید نشده فعالیت ${data.title}`);


      return data.title + `<button title='${title}' data-type='${data.type}' data-uid='${data.uuiidd}' data-parentid='${data.parentId ? data.parent()[data.parentId - 1].uuiidd : null}'
			class='pull-left btn btn-success btn-xs forFound_ApproveTaskAllDates' 
			style='margin-right:5px;padding: 4px 4px 0 ${bc};'>
				<i class='glyphicon glyphicon-ok' ${color}></i>
			</button>`;
    }

    if (data.has_NotApproveData_Other) {

      const type = data.uuiidd == '00000000-0000-0000-0000-000000000001' ? 'HourlyMission'
        : (data.uuiidd == '00000000-0000-0000-0000-000000000002' ? 'HourlyLeave'
          : (data.uuiidd == '00000000-0000-0000-0000-000000000003' ? 'DailyLeave' : null));

      const color = type == 'HourlyMission' ? 'style="color:#FAFAF2"' : (type == 'HourlyLeave' ? 'style="color:#E5F0FF"' : 'style="color:#CEFF9D"');
      const bc = type == 'HourlyMission' ? ';background-color:#FAFAF2' : (type == 'HourlyLeave' ? ';background-color:#E5F0FF' : ';background-color:#CEFF9D');
      const title = type == 'HourlyMission' ? `همه ماموریت های ساعتی تایید نشده` : (type == 'HourlyLeave' ? `همه مرخصی های ساعتی تایید نشده` : `همه مرخصی های روزانه تایید نشده`);


      return data.title + `<button title='${title}' data-type='${type}'
			class='pull-left btn btn-success btn-xs forFound_ApproveOtherAllDates' 
			style='margin-right:5px;padding: 4px 4px 0 ${bc};'>
				<i class='glyphicon glyphicon-ok' ${color}></i>
			</button>`;
    }


    return data.title;
  };
  columns.push(colTitle);

  ///-----------------------------------------------------------------

  for (var i = 0; i < response[0].values.length; i++) {

    const index = i;

    var tsDate = response[0].values[i];
    var colDate = new KTRColumnConfirm();
    //colDate.field = "values[" + i + "].value";
    colDate.title = tsDate.title;
    colDate.headerTemplate = "<h6><b>" + tsDate.persianDate + "</b></h6><h6><span>" + tsDate.persianDay + "</span></h6>";
    colDate.hidden = false;
    //تخصیص متد به تپلیت فقط باید ایندکس ها تنظیم گرددند
    colDate.template = (dataItem) => TreeListTemplateColumn(dataItem, index);
    colDate.width = 100;
    columns.push(colDate);

  }
  return columns;
}

function KTRColumn() {
  this.field = "";
  this.title = "";
  this.template = "";
  this.hidden = false;
  this.width = 40;
  this.headerTemplate = "";
  this.filterable = false;
}

function TreeListTemplateColumn(dataItem, index) {

  if (index >= dataItem.values.length) return "";

  const dd = "<b>" + dataItem.values[index].value + " </b>";

  if (dataItem.has_NotApproveData && dataItem.values[index].value != '' && dataItem.values[index].value != '0:00') {

    const color = dataItem.type == '-' ? 'style="color:#FAFAF2"' : (dataItem.type.startsWith('Project_') ? 'style="color:#E5F0FF"' : 'style="color:#CEFF9D"');
    const bc = dataItem.type == '-' ? ';background-color:#FAFAF2' : (dataItem.type.startsWith('Project_') ? ';background-color:#E5F0FF' : ';background-color:#CEFF9D');
    const title = dataItem.type == '-' ? `کارکردهای تایید نشده در ${dataItem.values[index].persianDate}` :
      (dataItem.type.startsWith('Project_') ? `کارکردهای تایید نشده پروژه ${dataItem.title} در ${dataItem.values[index].persianDate}` :
        `کارکردهای تایید نشده فعالیت ${dataItem.title} در ${dataItem.values[index].persianDate}`);


    return dataItem.values[index].value +
      `<button title='${title}' data-uid='${dataItem.uuiidd}' data-index='${index}' data-type='${dataItem.type}' 
			data-parentid='${dataItem.parentId ? dataItem.parent()[dataItem.parentId - 1].uuiidd : null}'
				 class='pull-left btn btn-success btn-xs forFound_ApproveTask' style='margin-right:5px;padding: 4px 4px 0 ${bc};'>
				 <i class='glyphicon glyphicon-ok' ${color}></i></button>`;

  } else if (dataItem.has_NotApproveData_Other && dataItem.values[index].value != '' && dataItem.values[index].value != '0:00') {

    const type = dataItem.uuiidd == '00000000-0000-0000-0000-000000000001' ? 'HourlyMission'
      : (dataItem.uuiidd == '00000000-0000-0000-0000-000000000002' ? 'HourlyLeave'
        : (dataItem.uuiidd == '00000000-0000-0000-0000-000000000003' ? 'DailyLeave' : null));
      
    if(type == 'DailyLeave') return dd;

    const color = type == 'HourlyMission' ? 'style="color:#FAFAF2"' : (type == 'HourlyLeave' ? 'style="color:#E5F0FF"' : 'style="color:#CEFF9D"');
    const bc = type == 'HourlyMission' ? ';background-color:#FAFAF2' : (type == 'HourlyLeave' ? ';background-color:#E5F0FF' : ';background-color:#CEFF9D');
    const title = type == 'HourlyMission' ? `ماموریت های ساعتی تایید نشده در ${dataItem.values[index].persianDate}` : (type == 'HourlyLeave' ? `مرخصی های ساعتی تایید نشده در ${dataItem.values[index].persianDate}` : `مرخصی های روزانه تایید نشده در ${dataItem.values[index].persianDate}`);

    return dataItem.values[index].value +
      `<button title='${title}' data-index='${index}' data-type='${type}'
				 class='pull-left btn btn-success btn-xs forFound_ApproveOther' style='margin-right:5px;padding: 4px 4px 0 ${bc};'>
				 <i class='glyphicon glyphicon-ok' ${color}></i></button>`;


  }
  else {
    if (dataItem.values[index].value == "0:00") {
      return "<b class='text-warning'>" + dataItem.values[index].value + " </b>"
    }
    else if (dataItem.values[index].value == "") {
      return "<b class='text-warning'> </b>"
    }
    else {
      return dd;
    }
  }

}

function ktrlTimeSheetsConfirm_dataBound(e) {

  var treeList = $("#ktrlTimeSheetsConfirm").data("kendoTreeList");
  common_timeSheet.expandTreeListItems(treeList, expandedRows);
  
  $('.forFound_ApproveTask').off().on('click', function () {
    const id = $(this).data("uid");
    const index = $(this).data("index");
    const parentId = $(this).data("parentid");
    const type = $(this).data("type");

    const projectId = type == 'Project' ? id : (type == 'TaskNotApprove' ? parentId : null);
    const taskId = type == 'TaskNotApprove' ? id : null;
    const date = dataService.timeSheetDataConfirm_get()[0].values[index].date;

    approveWindow.showItemsWaitingApproveWindow(projectId, taskId, date);
  });

  $('.forFound_ApproveTaskAllDates').off().on('click', function () {
    const id = $(this).data("uid");
    const parentId = $(this).data("parentid");
    const type = $(this).data("type");

    const projectId = type == 'Project' ? id : (type == 'TaskNotApprove' ? parentId : null);
    const taskId = type == 'TaskNotApprove' ? id : null;

    approveWindow.showItemsWaitingApproveWindow(projectId, taskId, null);
  });



  $('.forFound_ApproveOther').off().on('click', function () {
    const index = $(this).data("index");

    const type = $(this).data("type");
    const isDailyLeave = type == 'DailyLeave';
    const isHourlyLeave = type == 'HourlyLeave';
    const isHourlyMission = type == 'HourlyMission';

    const date = dataService.timeSheetDataConfirm_get()[0].values[index].date;

    approveWindow.showItemsWaitingApproveWindow_ForMissionLeave(isHourlyMission, isHourlyLeave, isDailyLeave, date);
  });

  $('.forFound_ApproveOtherAllDates').off().on('click', function () {
    const type = $(this).data("type");

    const isDailyLeave = type == 'DailyLeave';
    const isHourlyLeave = type == 'HourlyLeave';
    const isHourlyMission = type == 'HourlyMission';

    approveWindow.showItemsWaitingApproveWindow_ForMissionLeave(isHourlyMission, isHourlyLeave, isDailyLeave, null);
  });

}





function InitMonthlyByProjectsGridConfirm() {

  dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);

  var json = {
    value: dataService.timeSheetDataConfirm_get()[0].values[0],
    userid: dataService.userId_get()
  }


  var prmData = JSON.stringify(json);
  service.getThisMonthDataByUser(prmData, (response) => {

    const items = [response.presencepercent, response.workpercent];
    const v1 = common_timeSheet.calcPercent(items, response.presencepercent);
    const v2 = common_timeSheet.calcPercent(items, response.workpercent);

    $("#MonthlyPresenceconfirmProgress").text(common_timeSheet.convertMinutsToTime(response.presence));
    $("#MonthlyWorkHourconfirmProgress").text(common_timeSheet.convertMinutsToTime(response.work));

    $("#MonthlyPresenceconfirm").css('width', v1 + '%').attr('aria-valuenow', v1);
    $("#MonthlyWorkHourconfirm").css('width', v2 + '%').attr('aria-valuenow', v2);


    common.loaderHide();
  });

  service.getThisMonthProjectsByUserID(prmData, (response) => {
    $("#tblcurrmonthconfirm").kendoGrid({
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

    $("#DownSideTabsConfirm").show();
  });

}

function InitPeriodlyByProjectsGridConfirm() {
  dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);
  var json = {
    values: dataService.timeSheetDataConfirm_get()[0].values,
    userid: dataService.userId_get()
  }

  var prmData = JSON.stringify(json);

  service.getThisPeriodDataByUserId(prmData, (response) => {

    const items = [response.presencepercent, response.workpercent];
    const v1 = common_timeSheet.calcPercent(items, response.presencepercent);
    const v2 = common_timeSheet.calcPercent(items, response.workpercent);

    $("#PeriodicallyPresenceconfirmProgress").text(common_timeSheet.convertMinutsToTime(response.presence));
    $("#PeriodicallyWorkHourconfirmProgress").text(common_timeSheet.convertMinutsToTime(response.work));

    $("#PeriodicallyPresenceconfirm").css('width', v1 + '%').attr('aria-valuenow', v1);
    $("#PeriodicallyWorkHourconfirm").css('width', v2 + '%').attr('aria-valuenow', v2);
  });

  service.getThisPeriodProjectsByUserId(prmData, (response) => {
    $("#tblcurrperiodconfirm").kendoGrid({
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
    });
  });

}

function btnSendPeriodsconfirm_Onclick() {
  common.loaderShow();
  dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);
  WNDSelectPeriod_OnClose()
  if ($('#chkweeklyconfirm').is(':checked')) {

    service.changeDisplayPeriodToWeeklyConfirm(() => {
      RefreshTimeSheetConfirm();
    });

  }
  else {
    var PeriodJson = {
      Date: $("#startDateconfirm").val(),
      Days: $("#numberDaysconfirm").val(),
      IsWeekly: false,
      UserId: dataService.userId_get()
    };

    var prmData = JSON.stringify(PeriodJson);
    service.changeDisplayPeriodToDaily(prmData, () => {
      RefreshTimeSheetConfirm();
    });
  }

  fnlastRefreshCommand = RefreshTimeSheetConfirm;

}

function GetPreviousNextPeriodconfirm(type) {
  common.loaderShow();

  dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);

  let startDate = null;
  let endDate = null;

  if (type == 'previous') {
    startDate = dataService.timeSheetDataConfirm_get()[0].values[0].date;
  } else {
    var firstData = dataService.timeSheetDataConfirm_get()[0];
    endDate = firstData.values[firstData.values.length - 1].date;
  }

  fnlastRefreshCommand = () =>{
    service.getPreviousNextPeriodConfirm(dataService.userId_get(), startDate, endDate, (response) => {
      private_Refresh(response);
    });
  };

  fnlastRefreshCommand();

  
}




function EnableAndDisableSendPeriodRadioButtonConfirm() {

  if ($("#numberDaysconfirm").is(':disabled')) {

    $("#numberDaysconfirm").prop("disabled", false);
    $("#startDateconfirm").prop("disabled", false);

  } else {
    $("#numberDaysconfirm").prop("disabled", true);
    $("#startDateconfirm").prop("disabled", true);
  }

}
