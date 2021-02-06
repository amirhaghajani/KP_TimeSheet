//const data = require('./data');

//_________________________________________ناریخچه___________________________________
const historyWorkHour = (function () {

	const moduleData = {};

	function init(common, data) {

		moduleData.data = data;
		moduleData.common = common;

		$('#btnWorkHoureHistory_hide').off().on('click', function () {
			HideHistory();
		});
	}

	function Init_GRDHistory(e) {

		moduleData.common.loaderShow();

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
				moduleData.data.todayHistory_set(response);
				$("#WorkHourHistory").data("kendoGrid").dataSource.read();
				ShowHistory();
				moduleData.common.loaderHide();
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
						e.success(moduleData.data.todayHistory_get())
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
		Create_GrdHistory: Create_GrdHistory,
		HideHistory: HideHistory,
		init: init,
		Init_GRDHistory: Init_GRDHistory
	};
})();



module.exports = {
	'Create_GrdHistory': historyWorkHour.Create_GrdHistory,
	'HideHistory': historyWorkHour.HideHistory,
	'init': historyWorkHour.init,
	'Init_GRDHistory': historyWorkHour.Init_GRDHistory
}