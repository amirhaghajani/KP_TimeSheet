// const data = require('./data');
// const saveWindow = require('./createNewWorkHour');
// const history_sentWorkHour = require('./history_sentWorkHour');
// const sendWorkHour = require('./sendWorkHour');

const myMainGrid = (function () {

  const moduleData = {};

  function init(createNewWorkHour, history_sentWorkHour, sendWorkHour, data, service) {
    moduleData.data = data;
    moduleData.history_sentWorkHour = history_sentWorkHour;
    moduleData.createNewWorkHour = createNewWorkHour;
    moduleData.sendWorkHour = sendWorkHour;
    moduleData.service = service;

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

  function GetTimeSheets(callBackFn) {

    moduleData.service.getTimeSheets((response) => {
      if (callBackFn) callBackFn(response);
      ktrlTimeSheets_OnInit();
    });
  }

  function ktrlTimeSheets_OnInit() {
    Init_TimeSheetTreeList();
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
      columns: ktrlTSColumns,
      scrollable: true,
      selectable: true,
      dataBound: ktrlTimeSheets_DataBound
    });

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
      colDate.headerTemplate = "<h6><b>" + tsDate.persianDate + "</b></h6><h6>" + tsDate.persianDay + "</h6>";


      var inner = tsDate.value;
      if (inner == "False False") {
        colDate.headerTemplate += "<label title=' ' class='text-warning' ><i class='glyphicon glyphicon-ban-circle'></i> </label>"
      }

      if (inner == "True False" || inner == "True True") {

        colDate.headerTemplate += `<button title='ثبت ساعت کارکرد' 
                          class='btn btn-success btn-xs forFound_kwndSaveWHs_OnInit' style='width:10px;height:15px'
                          data-day-index='${i}'>+</button>`;

        colDate.headerTemplate += `<button title='نمایش کارکردهای این روز'   
              class='btn btn-info btn-xs forFound_ShowCurrentDaySendWorkHours' style='width:10px;height:15px;margin-right:10px;' 
              data-day-index='${i}'><i class='fa fa-tv'></i></button>`;
      }

      if (inner == "True True") {

        colDate.headerTemplate += `<button title='ارسال ساعت کارکرد'
              class='btn btn-warning btn-xs forFound_wndSendWorkHour_OnInit' style='width:10px;height:15px;margin-right:10px;'
              data-day-index='${i}'><b>↑</b></button>`;

      }

      colDate.hidden = false;
      colDate.width = 50;
      columns.push(colDate);
    }

    return columns;
  }

  function ktrlTimeSheets_DataBound(e) {

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

    moduleData.data.timeSheetData_set(response);
    common_register.removeAndRecreateTreelisDiv();
    Init_TimeSheetTreeList();
    //$("#ktrlTimeSheets").data("kendoTreeList").dataSource.read();
    common.LoaderHide();
  }

  return {
    GetTimeSheets: GetTimeSheets,
    Init_TimeSheetTreeList: Init_TimeSheetTreeList,
    init: init
  };

})();




//________________

module.exports = {

  'GetTimeSheets': myMainGrid.GetTimeSheets,
  'Init_TimeSheetTreeList': myMainGrid.Init_TimeSheetTreeList,
  'init': myMainGrid.init

};