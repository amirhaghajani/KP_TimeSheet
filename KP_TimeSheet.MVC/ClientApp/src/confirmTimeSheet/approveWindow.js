const approveWindow = (function () {

  const moduleData = {};

  function init(common, service, data) {
    moduleData.common = common;
    moduleData.service = service;
    moduleData.data = data;
    moduleData.thisGridType=null;

    $('#GrdMonitorWaitingApproveWorkHour_Hide').off().on('click', function () {
      $("#WndItemsWaitingApprove").data("kendoWindow").close();
    });

    $('#GrdMonitorWaitingApproveWorkHour_Send').off().on('click', function () {
      private_sendApproveDenyDataToServer();
    });

    $('#GrdMonitorWaitingApproveWorkHour_ApproveAll').off().on('click', function () {
      private_doApproveDenyAll('approve');
    });

    $('#GrdMonitorWaitingApproveWorkHour_DenyAll').off().on('click', function () {
      private_doApproveDenyAll('deny');
    });
  }

  function private_sendApproveDenyDataToServer(){
    debugger;
    var items = $("#GrdMonitorWaitingApproveWorkHour").data("kendoGrid").dataSource.data();
    
    var wanted='id';
    if(moduleData.thisGridType=='workhour') wanted='workHourId';

    var approved=[];
    var denyed=[];
    items.forEach(i=>{
      if(i.isApprove) approved.push(i[wanted]);
      if(i.isDeny) denyed.push(i[wanted]);
    });


    if(moduleData.thisGridType=='workhour'){

    }else alert(moduleData.thisGridType);
  }

  function private_doApproveDenyAll(type) {

    const grid = $("#GrdMonitorWaitingApproveWorkHour").data("kendoGrid");

    var items = [];

    grid.tbody.find('tr').each(function () {
      const item = grid.dataItem($(this));
      items.push(item);
    });

    items.forEach(i => {
      i.set(type == 'approve' ? "isApprove" : "isDeny", true);
      i.set(type == 'approve' ? "isDeny" : "isApprove", null);
    });
  }

  function showItemsWaitingApproveWindow(projectId, taskId, date) {
    moduleData.thisGridType=null;
    moduleData.common.loaderShow();

    let startDate = date;
    let endDate = date;

    if (!date) {
      var timeSheetData = moduleData.data.timeSheetDataConfirm_get()[0];
      startDate = timeSheetData.values[0].date;
      endDate = timeSheetData.values[timeSheetData.values.length - 1].date;

    }

    var data = {
      wantedUserId: moduleData.data.userId_get(),
      startDate: startDate,
      endDate: endDate
    };

    if (projectId) data.projectId = projectId;
    if (taskId) data.taskId = taskId;

    moduleData.service.getWaitingApproveWorkHourDetail(data, (response) => {

      moduleData.thisGridType='workhour';

      private_open_GrdMonitorSentWorkHour();
      var columns = [
        {
          title: "",
          template: function (dataItem, b, c) {
            let answer = dataItem.isSend ?
              '<i class="glyphicon glyphicon-upload" title="ارسال شده" style="color:gray; font-size:22px;"></i>'
              : '<i class="glyphicon glyphicon-download" title="برگشت شده" style="color:gray; font-size:22px;"></i>';
            return answer;
          },
          width: 40,
          editable: () => false
        },
        {
          field: "date_persian",
          title: "تاریخ",
          width: 100,
          editable: () => false
        },
        {
          field: "projectTitle",
          title: "پروژه",
          editable: () => false
        }, {
          field: "title",
          title: "وظیفه",
          editable: () => false
        }, {
          field: "minutes",
          title: "ساعت کار",
          width: 80,
          editable: () => false,
        }
        , {
          field: "description",
          title: "آخرین توضیحات",
          editable: () => false
        }
        , {
          field: "newDescription",
          title: "توضیحات تایید یا رد",
          filterable: false,
          sortable: false,
        }
        , {
          field: "isApprove",
          title: "تایید",
          type: "boolean",
          width: 50,
          filterable: false,
          sortable: false,
        }, {
          field: "isDeny",
          title: "رد",
          type: "boolean",
          width: 50,
          filterable: false,
          sortable: false,
        },
        {
          title: "",
          template: function (dataItem, b, c) {
            let answer = "<button type='button' class='btn btn-info btn-sm forFound_Init_GRDHistory' title='نمایش تاریخچه' name='info'>تاریخچه</button>";
            return answer;
          },
          filterable: false,
          sortable: false,
          width: 80
        }
      ];
      private_createEditGrid(response, columns, 7);

      moduleData.common.loaderHide();
    });

  }

  function showItemsWaitingApproveWindow_ForMissionLeave(isHourlyMission, isHourlyLeave, isDailyLeave, date) {
    
    moduleData.thisGridType=null;
    moduleData.common.loaderShow();

    let startDate = date;
    let endDate = date;

    if (!date) {
      var timeSheetData = moduleData.data.timeSheetDataConfirm_get()[0];
      startDate = timeSheetData.values[0].date;
      endDate = timeSheetData.values[timeSheetData.values.length - 1].date;
    }

    var data = {
      wantedUserId: moduleData.data.userId_get(),
      startDate: startDate,
      endDate: endDate
    };

    if (isHourlyMission) data.type = 1;
    if (isHourlyLeave) data.type = 2;
    if (isDailyLeave) data.type = 3;

    moduleData.service.getWaitingApproveMissionLeaveDetail(data, (response) => {
      
      moduleData.thisGridType=data.type;
      private_open_GrdMonitorSentWorkHour();

      var columns = [
        {
          title: "",
          template: function (dataItem, b, c) {
            let answer = dataItem.isSend ?
              '<i class="glyphicon glyphicon-upload" title="ارسال شده" style="color:gray; font-size:22px;"></i>'
              : '<i class="glyphicon glyphicon-download" title="برگشت شده" style="color:gray; font-size:22px;"></i>';
            return answer;
          },
          width: 40,
          editable: () => false
        },
        {
          field: "from",
          title: "از",
          width: 130,
          editable: () => false
        }
        ,
        {
          field: "to",
          title: "تا",
          width: 130,
          editable: () => false
        }
        , {
          field: "description",
          title: "آخرین توضیحات",
          editable: () => false
        }
        , {
          field: "newDescription",
          title: "توضیحات تایید یا رد",
          filterable: false,
          sortable: false,
        }
        , {
          field: "isApprove",
          title: "تایید",
          type: "boolean",
          width: 50,
          filterable: false,
          sortable: false,
        }, {
          field: "isDeny",
          title: "رد",
          type: "boolean",
          width: 50,
          filterable: false,
          sortable: false,
        },
        {
          title: "",
          template: function (dataItem, b, c) {
            let answer = "<button type='button' class='btn btn-info btn-sm forFound_Init_GRDHistory' title='نمایش تاریخچه' name='info'>تاریخچه</button>";
            return answer;
          },
          filterable: false,
          sortable: false,
          width: 80
        }
      ];

      private_createEditGrid(response, columns, 5);

      moduleData.common.loaderHide();
    });

  }

  function private_createEditGrid(response, columns, approveColumnIndexNumber) {

    var data = $("#GrdMonitorWaitingApproveWorkHour").data("kendoGrid");
    if (data) data.destroy();

    var grid = $("#GrdMonitorWaitingApproveWorkHour").kendoGrid();
    var options= {
      dataSource: {
        transport: {
          read: function (e) {
            e.success(response);

            // $('.forFound_Init_GRDHistory').off().on('click', function () {
            // 	moduleData.hisotory_workHour.Init_GRDHistory(this);
            // });
            // $('.forFound_EditWorkhoure').off().on('click', function () {
            // 	editWorkout(this);
            // });
          }
        },
        pageSize: 10
      },
      height: 450,
      pageable: true,
      filterable: true,
      selectable: true,

      columns: columns,
      editable: true,
      cellClose: function (e) {
        const cellIndex = e.container[0].cellIndex; //7 -> approve  8-> deny

        var select = this.select();
        var data = this.dataItem(select);

        if (cellIndex == approveColumnIndexNumber) {
          if (data.isApprove == null) return;
          data.set("isDeny", null);
        }
        if (cellIndex == approveColumnIndexNumber + 1) {
          if (data.isDeny == null) return;
          data.set("isApprove", null);
        }
      }

    };

    $("#GrdMonitorWaitingApproveWorkHour").data("kendoGrid").setOptions(options);

  }

  function private_open_GrdMonitorSentWorkHour() {
    HideHistory();
    moduleData.common.openWindow('WndItemsWaitingApprove');
  }

  function ShowHistory() {
    $("#PanelMonitorWorkHour").fadeOut(400);

    $("#PanelHistory").fadeIn(400);
    var gridElement = $("#WorkHourHistory");
    var dataArea = gridElement.find(".k-grid-content");
    gridElement.height("100%");
    dataArea.height("372px");
  }

  function HideHistory() {
    $("#PanelMonitorWorkHour").fadeIn(400);
    $("#PanelHistory").fadeOut(400);
  }

  return {
    showItemsWaitingApproveWindow: showItemsWaitingApproveWindow,
    showItemsWaitingApproveWindow_ForMissionLeave: showItemsWaitingApproveWindow_ForMissionLeave,
    init: init
  };

})();

module.exports = {
  showItemsWaitingApproveWindow: approveWindow.showItemsWaitingApproveWindow,
  showItemsWaitingApproveWindow_ForMissionLeave: approveWindow.showItemsWaitingApproveWindow_ForMissionLeave,
  init: approveWindow.init
};