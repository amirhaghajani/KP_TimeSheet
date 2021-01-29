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

    private_open_GrdMonitorSentWorkHour();
    //$("#WndItemsWaitingApprove").data("kendoWindow").setOptions({width: moduleData.common.window_width(), height: moduleData.common.window_height()});

    var data = {
      wantedUserId: moduleData.data.userId_get(),
      startDate: date,
      endDate: date
    };

    if (projectId) data.projectId = projectId;
    if (taskId) data.taskId = taskId;

    moduleData.service.getWaitingApproveWorkHourDetail(data, (response) => {
      private_createEditGrid(response);

      moduleData.common.loaderHide();
    });

  }

  function private_createEditGrid() {

  }

  function private_open_GrdMonitorSentWorkHour() {

    HideHistory();

    moduleData.common.openWindow('WndItemsWaitingApprove');

    


    // $("#GrdMonitorSentWorkHour").kendoGrid({
    // 	dataSource: {
    // 		transport: {
    // 			read: function (e) {
    // 				e.success(_MonitorSentWorkHours);

    // 				$('.forFound_Init_GRDHistory').off().on('click', function () {
    // 					moduleData.hisotory_workHour.Init_GRDHistory(this);
    // 				});
    // 				$('.forFound_EditWorkhoure').off().on('click', function () {
    // 					editWorkout(this);
    // 				});
    // 			}
    // 		},
    // 		pageSize: 10
    // 	},
    // 	height: 450,
    // 	pageable: true,
    // 	filterable: true,
    // 	selectable: true,

    // 	columns: [{
    // 		field: "persianDate",
    // 		title: "تاریخ",
    // 		width: 100
    // 	},
    // 	{
    // 		field: "projectTitle",
    // 		title: "پروژه"
    // 	}, {
    // 		field: "taskTitle",
    // 		title: "وظیفه"
    // 	}, {
    // 		field: "time",
    // 		title: "ساعت کار",
    // 		width: 80

    // 	}, {
    // 		field: "workFlowStageTitle",
    // 		title: "عنوان مرحله",
    // 		width: 200
    // 	}
    // 		, {
    // 		title: "نمایش تاریخچه   ",
    // 		template: function(dataItem,b,c){
    // 			let answer = "<button type='button' class='btn btn-info btn-sm forFound_Init_GRDHistory' title='نمایش تاریخچه' name='info'>تاریخچه</button>";
    // 			if(dataItem.workFlowStageType=='Resource'){
    // 				answer+="<button type='button' style='margin-right:2px;' class='btn btn-success btn-sm forFound_EditWorkhoure'>ویرایش</button>"
    // 			}
    // 			return answer;
    // 		},
    // 		headerTemplate: "<label class='text-center'> نمایش تاریخچه </label>",
    // 		filterable: false,
    // 		sortable: false,
    // 		width: 140
    // 	}
    // 	]

    // });


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