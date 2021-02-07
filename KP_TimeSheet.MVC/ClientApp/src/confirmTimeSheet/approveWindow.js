const approveWindow = (function () {

  const moduleData = {};

  function init(common, service, data, parentRefreshCommand) {
    moduleData.common = common;
    moduleData.service = service;
    moduleData.data = data;
    moduleData.thisGridType = null;
    moduleData.lastGetApproveDataFromServer = null;
    moduleData.parentRefreshCommand = parentRefreshCommand;

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

    $('#btnWorkHoureHistory_hide').off().on('click', function () {
			HideHistory();
		});
  }

  function private_sendApproveDenyDataToServer() {

    $('#GrdMonitorWaitingApproveWorkHour_Send').attr("disabled", "disabled");

    var items = $("#GrdMonitorWaitingApproveWorkHour").data("kendoGrid").dataSource.data();

    var wanted = 'id';
    if (moduleData.thisGridType == 'workhour') wanted = 'workHourId';

    var approved = [];
    var denyed = [];
    items.forEach(i => {
      if (i.isApprove) approved.push({ id: i[wanted], description: i.newDescription });
      if (i.isDeny) denyed.push({ id: i[wanted], description: i.newDescription });
    });

    moduleData.service.approveDenyItems(moduleData.thisGridType, approved, denyed, (data) => {
      moduleData.common.notify(data.message);

      if (moduleData.lastGetApproveDataFromServer) moduleData.lastGetApproveDataFromServer();

      $('#GrdMonitorWaitingApproveWorkHour_Send').removeAttr("disabled");

      moduleData.parentRefreshCommand();

    }, () => {
      $('#GrdMonitorWaitingApproveWorkHour_Send').removeAttr("disabled");
    });

  }

  function private_doApproveDenyAll(type) {

    const grid = $("#GrdMonitorWaitingApproveWorkHour").data("kendoGrid");

    var items = [];

    grid.tbody.find('tr').each(function () {
      const item = grid.dataItem($(this));
      item.isApprove = type == 'approve';
      item.isDeny = type != 'approve';
    });


    $("#GrdMonitorWaitingApproveWorkHour tbody .forFound_approveCheckbox").prop("checked",type == 'approve');
    $("#GrdMonitorWaitingApproveWorkHour tbody .forFound_denyCheckbox").prop("checked",type != 'approve');

  }

  function showItemsWaitingApproveWindow(projectId, taskId, date, notNeedOpenWindow) {

    moduleData.lastGetApproveDataFromServer = () => showItemsWaitingApproveWindow(projectId, taskId, date, true);

    moduleData.thisGridType = null;
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

      moduleData.thisGridType = 'workhour';

      if (!notNeedOpenWindow) private_open_GrdMonitorSentWorkHour();

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
          template: function (dataItem, b, c) {
            let answer = "<input type='checkbox' class='forFound_approveCheckbox' />";
            return answer;
          },
          width: 50,
          filterable: false,
          sortable: false,
          editable: () => false
        }, {
          field: "isDeny",
          title: "رد",
          template: function (dataItem, b, c) {
            let answer = "<input type='checkbox' class='forFound_denyCheckbox' />";
            return answer;
          },
          width: 50,
          filterable: false,
          sortable: false,
          editable: () => false
        },
        {
          title: "",
          template: function (dataItem, b, c) {
            let answer = "<button type='button' class='btn btn-info btn-sm forFound_Init_GRDHistory' title='نمایش تاریخچه' name='info'>تاریخچه</button>";
            return answer;
          },
          filterable: false,
          sortable: false,
          width: 80,
          editable: () => false
        }
      ];
      private_createEditGrid(response, columns);

      moduleData.common.loaderHide();
    });

  }

  function showItemsWaitingApproveWindow_ForMissionLeave(isHourlyMission, isHourlyLeave, isDailyLeave, date, notNeedOpenWindow) {

    moduleData.lastGetApproveDataFromServer = () => showItemsWaitingApproveWindow_ForMissionLeave(isHourlyMission, isHourlyLeave, isDailyLeave, date, true);

    moduleData.thisGridType = null;
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

      moduleData.thisGridType = data.type;
      if (!notNeedOpenWindow) private_open_GrdMonitorSentWorkHour();

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
          template: function (dataItem, b, c) {
            let answer = "<input type='checkbox' class='forFound_approveCheckbox' />";
            return answer;
          },
          width: 50,
          filterable: false,
          sortable: false,
          editable: () => false
        }, {
          field: "isDeny",
          title: "رد",
          template: function (dataItem, b, c) {
            let answer = "<input type='checkbox' class='forFound_denyCheckbox' />";
            return answer;
          },
          width: 50,
          filterable: false,
          sortable: false,
          editable: () => false
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

      private_createEditGrid(response, columns);

      moduleData.common.loaderHide();
    });

  }

  function private_createEditGrid(response, columns) {

    var data = $("#GrdMonitorWaitingApproveWorkHour").data("kendoGrid");
    if (data) data.destroy();

    var grid = $("#GrdMonitorWaitingApproveWorkHour").kendoGrid();
    var options = {
      dataSource: {
        transport: {
          read: function (e) {
            e.success(response);

            $('.forFound_Init_GRDHistory').off().on('click', function () {
              private_init_GRDHistory(this);
            });

            $('.forFound_approveCheckbox').off().on('change', function () {
              private_approveCheckBoxChanged(this,this.checked);
            });

            $('.forFound_denyCheckbox').off().on('change', function () {
              private_denyCheckBoxChanged(this,this.checked);
            });

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
      
    };

    $("#GrdMonitorWaitingApproveWorkHour").data("kendoGrid").setOptions(options);

  }


  function Create_GrdHistory(data) {

		$("#WorkHourHistory").kendoGrid({
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

			columns: [{
				field: "persianDate",
				title: "تاریخ",
				width: 100
			},
			{
				field: "time",
				title: "ساعت",
				width: 80
			},
			{
				field: "managerName",
				title: "نام اقدام کننده",
				width: 200
			}, {
				field: "action",
				title: "عملیات",
				width: 120
			}, {
				field: "stageTitle",
				title: "مرحله",
				width: 120

			}, {
				field: "description",
				title: "توضیحات",
				width: 400

			}
			]

		});
	}

  function private_approveCheckBoxChanged(e, isCheck){

    var grid = $("#GrdMonitorWaitingApproveWorkHour").data("kendoGrid");
		var dataItem = grid.dataItem($(e).closest("tr"));

    dataItem.isApprove = isCheck;

    if(isCheck){
      dataItem.isDeny = false;
      $(e).parent().parent().find('.forFound_denyCheckbox').prop('checked',false);
    }
  }
  function private_denyCheckBoxChanged(e, isCheck){
    var grid = $("#GrdMonitorWaitingApproveWorkHour").data("kendoGrid");
		var dataItem = grid.dataItem($(e).closest("tr"));

    dataItem.isDeny = isCheck;
    
    if(isCheck){
      dataItem.isApprove = false;
      $(e).parent().parent().find('.forFound_approveCheckbox').prop('checked',false);
    }
  }

  function private_init_GRDHistory(e){

    var grid = $("#GrdMonitorWaitingApproveWorkHour").data("kendoGrid");
		var dataItem = grid.dataItem($(e).closest("tr"));
		
		$.ajax({
			type: "Get",
			url: `/api/timesheetsNew/GetHistoryWorkHour/${dataItem.workHourId ? dataItem.workHourId : workHourId.id}`,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (response) {
				Create_GrdHistory(response);
				$("#WorkHourHistory").data("kendoGrid").dataSource.read();
				ShowHistory();
				moduleData.common.loaderHide();
			},
			error: function (e) {

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
    showItemsWaitingApproveWindow_ForMissionLeave: showItemsWaitingApproveWindow_ForMissionLeave,
    init: init
  };

})();

module.exports = {
  showItemsWaitingApproveWindow: approveWindow.showItemsWaitingApproveWindow,
  showItemsWaitingApproveWindow_ForMissionLeave: approveWindow.showItemsWaitingApproveWindow_ForMissionLeave,
  init: approveWindow.init
};