const myMainGrid = (function () {

  const moduleData = {};

  function init(common, common_register, common_timeSheet, createNewWorkHour, history_sentWorkHour, sendWorkHour,
    data, service, editWindow, history_sentWorkHour, priodlyGrid, monthlyGrid) {

    moduleData.common = common;
    moduleData.common_register = common_register;
    moduleData.common_timeSheet = common_timeSheet;

    moduleData.data = data;
    moduleData.history_sentWorkHour = history_sentWorkHour;
    moduleData.createNewWorkHour = createNewWorkHour;
    moduleData.sendWorkHour = sendWorkHour;
    moduleData.service = service;

    moduleData.editWindow = editWindow;
    moduleData.history_sentWorkHour = history_sentWorkHour;

    moduleData.priodlyGrid = priodlyGrid;
    moduleData.monthlyGrid = monthlyGrid;

    moduleData.expandedRows = [];
  };

  function KTRColumn() {
    this.field = "";
    this.title = "";
    this.template = "";
    this.hidden = false;
    this.width = 40;
    this.headerTemplate = "";
    this.filterable = false;
  };


  //________________ جهت باز سازی TreeList اصلی

  function RefreshTimeSheet(reset = false) {
    moduleData.common.loaderShow();

    let fromDate = null;
    let toDate = null;
    if (!reset) {
      var prmData = moduleData.data.timeSheetData_get()[0].values;
      fromDate = prmData[0].date;
      toDate = prmData[prmData.length - 1].date;
    }
    GetTimeSheets(() => {
      ResetAllThings();

    }, fromDate, toDate);
  }

  function ResetAllThings() {

    var treeList = $("#ktrlTimeSheets").data("kendoTreeList");
    moduleData.expandedRows = moduleData.common_timeSheet.foundExpandedTreeListTitle(treeList);


    moduleData.common_register.removeAndRecreateTreelisDiv();

    moduleData.editWindow.Refresh_GrdEditWorkHour();
    moduleData.history_sentWorkHour.Refresh_GrdMonitorSentWorkHour();


    moduleData.priodlyGrid.InitPeriodlyByProjectsGrid();
    moduleData.monthlyGrid.InitMonthlyByProjectsGrid();

    moduleData.common.loaderHide();
  }
  //----------

  function GetTimeSheets(callBackFn, fromDate, toDate) {

    moduleData.service.getTimeSheets(fromDate, toDate, (response) => {
      if (callBackFn) callBackFn(response);
      Init_TimeSheetTreeList();
    });
  }

  function Init_TimeSheetTreeList() {

    const timeSheetData = moduleData.data.timeSheetData_get();
    const timeSheetData2 = timeSheetData.slice(1);

    var ktrlTSColumns = ktrlTimeSheets_OnInitColumns(timeSheetData);

    $("#ktrlTimeSheets").kendoTreeList({
      dataSource: {
        transport: {
          read: function (e) {
            e.success(timeSheetData2);
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
      width: 'auto',
      columns: ktrlTSColumns,
      scrollable: true,
      selectable: true,
      dataBound: ktrlTimeSheets_DataBound
    });

    //تول تیپ درست کار نمی کرد برداشتم. جاش را اشتباه نشان می داد

    // var tooltip = $("#ktrlTimeSheets").kendoTooltip({
    //   filter: 'td',
    //   content: function (e) {
    //     var treelist = $("#ktrlTimeSheets").data("kendoTreeList");
    //     var targetRow = $(e.target).closest('tr');
    //     var dataItem = treelist.dataItem(targetRow);
    //     return dataItem.title;
    //   },
    //   position: "left",
    //   animation: {
    //     open: {
    //       effects: "zoom",
    //       duration: 150
    //     }
    //   }
    // }).data("kendoTooltip");

    $("#ktrlTimeSheets tbody").on("dblclick", "td", function (e) {

      var cell = $(e.currentTarget);
      var cellIndex = cell[0].cellIndex;
      var grid = $("#ktrlTimeSheets").data("kendoTreeList");
      var column = grid.columns[cellIndex];
      var dataItem = grid.dataItem(cell.closest("tr"));

      if (dataItem.type != 'Karkard' && dataItem.type != 'Project' && dataItem.type != 'Workout') return;

      if (cellIndex<3 || !dataItem.values) return;
      var sotoon = dataItem.values[cellIndex - 3];

      if (dataItem.type == 'Workout') {

        const items = [];
        const item = {};
        const taskId = dataItem.uuiidd;

        var parent = grid.dataSource.parentNode(dataItem);
        var projectId = parent.uuiidd;
        item.projectTitle = parent.title;

        if (sotoon.value.indexOf('0:00') == 0) {

          moduleData.createNewWorkHour.kwndSaveWHs_OnInit_ForEdit(cellIndex - 3, projectId, taskId, null);
          return;
        } else {

          $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetWorkHoursByDate",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ date: sotoon.date, taskId: taskId }),
            success: function (response) {
              debugger;
              if (response && response.length == 1 && response[0].workFlowStageType=='Resource') {
                moduleData.createNewWorkHour.kwndSaveWHs_OnInit_ForEdit(cellIndex - 3, projectId, taskId, sotoon.value);
              } else {
                for (var k in response) {
                  const item = response[k];
                  item.time = moduleData.common_timeSheet.convertMinutsToTime(item.minutes);
                }
                moduleData.history_sentWorkHour.ShowDataOnGrid(response);
              }
            },
            error: function (e) {
              var a = e;
            }
          });

        }
        return;
      }

      if (dataItem.type == 'Project') {
        debugger;
        $.ajax({
          type: "Post",
          url: "/api/TimeSheetsAPI/GetWorkHoursByDate",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          data: JSON.stringify({ date: sotoon.date, projectId: dataItem.uuiidd }),
          success: function (response) {

            for (var k in response) {
              const item = response[k];
              item.time = moduleData.common_timeSheet.convertMinutsToTime(item.minutes);
            }
            moduleData.history_sentWorkHour.ShowDataOnGrid(response);

          },
          error: function (e) {
            var a = e;
          }
        });

        return;
      }

      if (dataItem.type == 'Karkard') {
        moduleData.history_sentWorkHour.ShowCurrentDaySendWorkHours(cellIndex - 3);
        return;
      }




      //alert("Satr: " + dataItem.title + " - Sotoon: " + dataItem.values[cellIndex - 3].title + " - type: "+dataItem.type);




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

      colTitle.width = 240;
    columns.push(colTitle);

    for (var i = 0; i < response[0].values.length; i++) {

      var tsDate = response[0].values[i];
      var colDate = new KTRColumn();
      colDate.field = "values[" + i + "].value";
      //colDate.template = "#= type=='Defference' ? '<span title=\"تایید شده\">1:00</span> | <span title=\"برگشت شده\">2:00</span>' :  (values[ " + i + " ].value) #";
      colDate.format = "";
      colDate.title = tsDate.title;
      colDate.headerTemplate = "<h6 style='text-align:center'><b>" + tsDate.persianDate + "</b></h6><h6 style='text-align:center'>" + tsDate.persianDay + "</h6>";

      var inner = tsDate.value;

      colDate.headerTemplate += "<div style='text-align:center'>";

      if (!inner.isOpen && !inner.has_NotSendData && !inner.hasKarkard) {
        colDate.headerTemplate += "<label title=' ' class='text-warning' ><i class='glyphicon glyphicon-ban-circle'></i> </label>"
      }

      if (inner.isOpen) {

        colDate.headerTemplate += `<button title='ثبت ساعت کارکرد' 
                          class='btn btn-success btn-xs forFound_kwndSaveWHs_OnInit' style='width:10px;height:15px'
                          data-day-index='${i}'>+</button>`;
      }
      if (inner.hasKarkard) {

        colDate.headerTemplate += `<button title='نمایش کارکردهای این روز'   
              class='btn btn-info btn-xs forFound_ShowCurrentDaySendWorkHours' style='width:10px;height:15px;margin-right:5px;' 
              data-day-index='${i}'><i class="glyphicon glyphicon-exclamation-sign"></i></button>`;
      }

      if (inner.has_NotSendData) {

        colDate.headerTemplate += `<button title='ارسال ساعت کارکرد'
              class='btn btn-warning btn-xs forFound_wndSendWorkHour_OnInit' style='width:10px;height:15px;margin-right:5px;'
              data-day-index='${i}'><b>↑</b></button>`;

      }
      colDate.headerTemplate += "</div>";

      colDate.hidden = false;
      colDate.width = 100;
      columns.push(colDate);
    }

    return columns;
  }

  function ktrlTimeSheets_DataBound(e) {

    var treeList = $("#ktrlTimeSheets").data("kendoTreeList");
    moduleData.common_timeSheet.expandTreeListItems(treeList, moduleData.expandedRows);


    $('.forFound_kwndSaveWHs_OnInit').off().on('click', function () {
      var id = $(this).data("dayIndex");
      moduleData.createNewWorkHour.kwndSaveWHs_OnInit(id);
    });

    $('.forFound_ShowCurrentDaySendWorkHours').off().on('click', function () {
      var sendId = $(this).data("dayIndex");
      moduleData.history_sentWorkHour.ShowCurrentDaySendWorkHours(sendId);
    });

    $('.forFound_wndSendWorkHour_OnInit').off().on('click', function () {
      var semlId = $(this).data("dayIndex");
      moduleData.sendWorkHour.wndSendWorkHour_OnInit(semlId);
    });
  }






  return {
    GetTimeSheets: GetTimeSheets,
    Init_TimeSheetTreeList: Init_TimeSheetTreeList,
    RefreshTimeSheet: RefreshTimeSheet,
    init: init,
    ResetAllThings: ResetAllThings
  };

})();




//________________

module.exports = {

  'GetTimeSheets': myMainGrid.GetTimeSheets,
  'Init_TimeSheetTreeList': myMainGrid.Init_TimeSheetTreeList,
  'RefreshTimeSheet': myMainGrid.RefreshTimeSheet,
  'init': myMainGrid.init,
  ResetAllThings: myMainGrid.ResetAllThings

};