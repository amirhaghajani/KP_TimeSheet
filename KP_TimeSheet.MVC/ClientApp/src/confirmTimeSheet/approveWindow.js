const approveWindow = (function () {

  const moduleData = {};

  function init(common, service, data) {
    moduleData.common = common;
    moduleData.service = service;
    moduleData.data = data;

    $('#GrdMonitorWaitingApproveWorkHour_Hide').off().on('click', function () {
      $("#WndItemsWaitingApprove").data("kendoWindow").close();
    });
  }


  function showItemsWaitingApproveWindow(projectId, taskId, date) {

    moduleData.common.loaderShow();

    let startDate = date;
    let endDate = date;

    debugger;

    if(!date){
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

      private_open_GrdMonitorSentWorkHour();
      private_createEditGrid(response);

      moduleData.common.loaderHide();
    });

  }

  function private_createEditGrid(response) {

    $("#GrdMonitorWaitingApproveWorkHour").kendoGrid({
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

      columns: [
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
      ],
      editable: true,
      cellClose: function (e) {
        const cellIndex = e.container[0].cellIndex; //7 -> approve  8-> deny

        var select = this.select();
        var data = this.dataItem(select);

        if (cellIndex == 7) {
          if (data.isApprove == null) return;
          data.set("isDeny", null);
        }
        if (cellIndex == 8) {
          if (data.isDeny == null) return;
          data.set("isApprove", null);
        }
      }

    });

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
    init: init
  };

})();

module.exports = {
  showItemsWaitingApproveWindow: approveWindow.showItemsWaitingApproveWindow,
  init: approveWindow.init
};