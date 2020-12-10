// const common = require('../common/common');
// const data = require('./data');
// const hisotory_workHour=require('./hisotory_workHour');
// const common_register = require('./common');

//______________________نمایش کارکرد های ارسال شده
const hisotrSentWorkHour = (function () {

	const moduleData={};

	function init(common, common_register, hisotory_workHour, data) {

		moduleData.data = data;
		moduleData.common = common;
		moduleData.common_register = common_register;
		moduleData.hisotory_workHour = hisotory_workHour;

		$('#btnMonitorSent').off().on('click', function () {
			GetWorkHours_MonitorSentWorkHour();
		});

		$('#GrdMonitorSentWorkHour_Hide').off().on('click', function () {
			Close_WndMonitorSentWorkHours();
		});
	}

	function Close_WndMonitorSentWorkHours() {
		$("#WndMonitorSentWorkHours").data("kendoWindow").close()
	}

	function Open_WndMonitorSentWorkHours() {
		$("#WndMonitorSentWorkHours").data("kendoWindow").open()
	}

	function GetWorkHours_MonitorSentWorkHour() {


		var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values);

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

		moduleData.hisotory_workHour.Create_GrdHistory();
		moduleData.hisotory_workHour.HideHistory();
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
			open: moduleData.common_register.adjustSize,
		}).data("kendoWindow").center().open();

		$("#GrdMonitorSentWorkHour").kendoGrid({
			dataSource: {
				transport: {
					read: function (e) {
						e.success(_MonitorSentWorkHours);

						$('.forFound_Init_GRDHistory').off().on('click',function(){
							moduleData.hisotory_workHour.Init_GRDHistory(this);
						});
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
				title: "تاریخ"
			},
			{
				field: "projectTitle",
				title: "پروژه"
			}, {
				field: "taskTitle",
				title: "وظیفه"
			}, {
				field: "hours",
				title: "ساعت کار",
				width: 80

			}, {
				field: "workFlowStageTitle",
				title: "عنوان مرحله",
				width: 200
			}
				, {
				title: "نمایش تاریخچه   ",
				template: "<button type='button' class='btn btn-primary btn-sm forFound_Init_GRDHistory' name='info' title='نمایش تاریخچه' > نمایش تاریخچه</button>",
				headerTemplate: "<label class='text-center'> نمایش تاریخچه </label>",
				filterable: false,
				sortable: false,
				width: 100
			}
			]

		});

		
	}

	function Refresh_GrdMonitorSentWorkHour() {
		var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values);
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

	function ShowCurrentDaySendWorkHours(dayIndex) {
		moduleData.common.LoaderShow();
		moduleData.hisotory_workHour.Create_GrdHistory();

		var timeSheetData = moduleData.data.timeSheetData_get();
        moduleData.data.selDate_set(timeSheetData[0].values[dayIndex]);

		var workHourJson = {
			ID: null,
			Date: moduleData.data.selDate_get().date
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

				moduleData.common.LoaderHide();
			},
			error: function (e) {
				var a = e;
			}
		});


	}

	return {
		Refresh_GrdMonitorSentWorkHour: Refresh_GrdMonitorSentWorkHour,
		Init_GrdMonitorSentWorkHour: Init_GrdMonitorSentWorkHour,
		init: init,
		ShowCurrentDaySendWorkHours: ShowCurrentDaySendWorkHours
	};

})();



module.exports = {
	'Refresh_GrdMonitorSentWorkHour': hisotrSentWorkHour.Refresh_GrdMonitorSentWorkHour,
	'Init_GrdMonitorSentWorkHour': hisotrSentWorkHour.Init_GrdMonitorSentWorkHour,
	'init': hisotrSentWorkHour.init,
	'ShowCurrentDaySendWorkHours': hisotrSentWorkHour.ShowCurrentDaySendWorkHours
}
