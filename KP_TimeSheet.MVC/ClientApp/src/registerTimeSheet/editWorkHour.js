// const data = require('./data');
// const common_register = require('./common');

//____________ویرایش
const editWorkHour = (function () {

	const moduleData = {};

	function init(mainGrid, common, common_register, data, common_timeSheet) {
		moduleData.mainGrid = mainGrid;
		moduleData.common = common;
		moduleData.common_register = common_register;
		moduleData.data = data;
		moduleData.common_timeSheet = common_timeSheet;

		$('#btnEditWorkHour').off().on('click', function () {
			WndEditWorkHours_OnInit();
		});

		$('#btn_Close_WndEditWorkHours').off().on('click', function () {
			Close_WndEditWorkHours();
		});

	}

	function WndEditWorkHours_OnInit() {
		GetWorkHours_GrdEditWorkHour();

		var kwndSaveWHs = $("#WndEditWorkHours");
		kwndSaveWHs.kendoWindow({
			width: moduleData.common.window_width(),
			height: moduleData.common.window_height(),

			activate: moduleData.common.addNoScrollToBody,
			deactivate: moduleData.common.removeNoScrollToBody,

			scrollable: true,
			visible: false,
			modal: true,
			actions: [
				"Pin",
				"Minimize",
				"Maximize",
				"Close"
			],
			//open: moduleData.common.adjustSize,
		}).data("kendoWindow").center().open();
	}

	function Close_WndEditWorkHours() {
		$("#WndEditWorkHours").data("kendoWindow").close()
	}

	function GetWorkHours_GrdEditWorkHour() {

		var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values);

		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetRegistereCurrentPerioddWorkHours",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: function (response) {
				for (var k in response) {
					const item = response[k];
					item.time = moduleData.common_timeSheet.convertMinutsToTime(item.minutes);
				}
				moduleData.data.workHours_set(response);
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
						e.success(moduleData.data.workHours_get())
					}
				},
				pageSize: 10
			},
			height: 520,
			pageable: true,
			filterable: true,

			selectable: true,

			columns: [{
				field: "persianDate",
				title: "تاریخ"
			},
			{
				field: "projectTitle",
				title: "پروژه"
			}, {
				field: "taskTitle",
				title: "وظیفه"
			}, {
				field: "time",
				title: "ساعت کار ثبت شده    "
			},


			{
				title: "حذف ",
				template: "<button  type='button' class='btn btn-danger btn-sm forFound_DeleteWorkHourEditGrid' name='info' title='حذف' > حذف</button>",
				headerTemplate: "<label class='text-center'> حذف </label>",
				filterable: false,
				sortable: false,
				width: 100
			},
			],
			dataBound: GrdEditWorkHour_DataBound

		});
	}

	function GrdEditWorkHour_DataBound(e) {
		$('.forFound_DeleteWorkHourEditGrid').off().on('click', function () {
			DeleteWorkHourEditGrid(this);
		});
	}

	function DeleteWorkHourEditGrid(e) {

		var grid = $("#GrdEditWorkHour").data("kendoGrid");
		var dataItem = grid.dataItem($(e).closest("tr"));


		moduleData.common.loaderShow();


		var prmData = JSON.stringify(dataItem);

		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/DeleteWorkHours",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: function (response) {
				Refresh_GrdEditWorkHour();

				moduleData.mainGrid.RefreshTimeSheet();
				moduleData.common.loaderHide();
			},
			error: function (e) {
				alert(dataItem.ID);
			}
		});



	}

	function Refresh_GrdEditWorkHour() {
		var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values);
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetRegistereCurrentPerioddWorkHours",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: function (response) {
				moduleData.data.workHours_set(response);
				var g = $("#GrdEditWorkHour").data("kendoGrid");
				if (g) g.dataSource.read();
			},
			error: function (e) {
			}
		});
	}

	return {
		'WndEditWorkHours_OnInit': WndEditWorkHours_OnInit,
		'init': init,
		'Refresh_GrdEditWorkHour': Refresh_GrdEditWorkHour
	};
})();



module.exports = {
	'WndEditWorkHours_OnInit': editWorkHour.WndEditWorkHours_OnInit,
	'init': editWorkHour.init,
	'Refresh_GrdEditWorkHour': editWorkHour.Refresh_GrdEditWorkHour
}