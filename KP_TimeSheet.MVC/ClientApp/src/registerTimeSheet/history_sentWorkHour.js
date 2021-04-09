// const common = require('../common/common');
// const data = require('./data');
// const hisotory_workHour=require('./hisotory_workHour');
// const common_register = require('./common');

//______________________نمایش کارکرد های ارسال شده
const hisotrSentWorkHour = (function () {

	const moduleData = {};

	function init(mainGrid, common, common_register, hisotory_workHour, data, common_timeSheet, createNewWorkHour, service) {
		moduleData.mainGrid = mainGrid;
		moduleData.data = data;
		moduleData.common = common;
		moduleData.common_register = common_register;
		moduleData.hisotory_workHour = hisotory_workHour;
		moduleData.common_timeSheet = common_timeSheet;
		moduleData.createNewWorkHour = createNewWorkHour;
		moduleData.service = service;

		$('#btnMonitorSent').off().on('click', function () {
			GetWorkHours_MonitorSentWorkHour();
		});

		$('#GrdMonitorSentWorkHour_Hide').off().on('click', function () {
			$("#WndMonitorSentWorkHours").data("kendoWindow").close();
		});
	}

	

	function Open_WndMonitorSentWorkHours() {
		$("#WndMonitorSentWorkHours").data("kendoWindow").open()
	}

	function GetWorkHours_MonitorSentWorkHour() {
		moduleData.data.history_sentWorkHour_data_set({type: 'history'});

		$('#headerText_MonitorSendWorkHours').text('نمایش کارکردهای ارسال شده');
		var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values);

		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetCurrentPeriodSentWorkHours",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: function (response) {

				for (var k in response) {
					const item = response[k];
					item.time = moduleData.common_timeSheet.convertMinutsToTime(item.minutes);
				}

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

		moduleData.common.openWindow('WndMonitorSentWorkHours');

		$("#GrdMonitorSentWorkHour").kendoGrid({
			dataSource: {
				transport: {
					read: function (e) {
						e.success(_MonitorSentWorkHours);

						$('.forFound_Init_GRDHistory').off().on('click', function () {
							moduleData.hisotory_workHour.Init_GRDHistory(this);
						});
						$('.forFound_EditWorkhoure').off().on('click', function () {
							editWorkout(this);
						});
						$('.forFound_DeleteWorkhoure').off().on('click', function () {
							deleteWorkHourEditGrid(this);
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
				title: "تاریخ",
				width: 100
			},
			{
				field: "projectTitle",
				title: "پروژه"
			}, {
				field: "taskTitle",
				title: "وظیفه"
			}, {
				field: "time",
				title: "ساعت کار",
				width: 80

			}, {
				field: "workFlowStageTitle",
				title: "عنوان مرحله",
				width: 200
			}
				, {
				title: "نمایش تاریخچه   ",
				template: function(dataItem,b,c){
					let answer = "<button type='button' class='btn btn-info btn-sm forFound_Init_GRDHistory' title='نمایش تاریخچه' name='info'>تاریخچه</button>";
					if(dataItem.workFlowStageType=='Resource'){
						answer+="<button type='button' style='margin-right:2px;' class='btn btn-success btn-sm forFound_EditWorkhoure'>ویرایش</button>"
						answer+="<button type='button' style='margin-right:5px;' class='btn btn-danger btn-sm forFound_DeleteWorkhoure'>حذف</button>"
					}
					return answer;
				},
				headerTemplate: "<label class='text-center'> نمایش تاریخچه </label>",
				filterable: false,
				sortable: false,
				width: 200
			}
			]

		});


	}

	function editWorkout(e){
		var grid = $("#GrdMonitorSentWorkHour").data("kendoGrid");
		var dataItem = grid.dataItem($(e).closest("tr"));

		moduleData.createNewWorkHour.kwndSaveWHs_OnInit_ForEdit(moduleData.data.selDate_get(), 
			dataItem.projectID, dataItem.taskID, dataItem.time, dataItem.id);
	}

	function deleteWorkHourEditGrid(e) {

		var grid = $("#GrdMonitorSentWorkHour").data("kendoGrid");
		var dataItem = grid.dataItem($(e).closest("tr"));


		moduleData.common.loaderShow();

		moduleData.service.deleteWorkHour(dataItem.id,()=>{
				moduleData.mainGrid.RefreshTimeSheet();
				moduleData.common.loaderHide();
		});
	}

	function ShowDataOnGrid(data, headerTitle) {
		if(headerTitle) $('#headerText_MonitorSendWorkHours').text(headerTitle);

		_MonitorSentWorkHours = data;
		Init_GrdMonitorSentWorkHour();
	}

	function Refresh_GrdMonitorSentWorkHour() {

		var data = moduleData.data.history_sentWorkHour_data_get();
		if(data.type !='history' && data.payload){
			ShowCurrentDaySendWorkHours(data.payload.dayTime , data.payload.headerTitle, true);
			return;
		}

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

				_MonitorSentWorkHours = response;
				var g = $("#GrdMonitorSentWorkHour").data("kendoGrid");

				if (g) g.dataSource.read();
			},
			error: function (e) {
			}
		});
	}

	function ShowCurrentDaySendWorkHours(dayTime, headerTitle, dontInit) {

		moduleData.data.history_sentWorkHour_data_set({type: 'currentDay', payload:{dayTime: dayTime , headerTitle: headerTitle}});

		if(headerTitle) $('#headerText_MonitorSendWorkHours').text(headerTitle);

		moduleData.common.loaderShow();
		moduleData.data.selDate_set(dayTime);

		var workHourJson = {
			ID: null,
			Date: dayTime.date
		}

		var prmData = JSON.stringify(workHourJson);

		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetWorkHoursByDate",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: function (response) {

				for (var k in response) {
					const item = response[k];
					item.time = moduleData.common_timeSheet.convertMinutsToTime(item.minutes);
				}
				
				_MonitorSentWorkHours = response;
				if(!dontInit) Init_GrdMonitorSentWorkHour();
				$("#GrdMonitorSentWorkHour").data("kendoGrid").dataSource.read();
				Open_WndMonitorSentWorkHours();

				moduleData.common.loaderHide();
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
		ShowCurrentDaySendWorkHours: ShowCurrentDaySendWorkHours,

		ShowDataOnGrid: ShowDataOnGrid
	};

})();



module.exports = {
	'Refresh_GrdMonitorSentWorkHour': hisotrSentWorkHour.Refresh_GrdMonitorSentWorkHour,
	'Init_GrdMonitorSentWorkHour': hisotrSentWorkHour.Init_GrdMonitorSentWorkHour,
	'init': hisotrSentWorkHour.init,
	'ShowCurrentDaySendWorkHours': hisotrSentWorkHour.ShowCurrentDaySendWorkHours,

	ShowDataOnGrid: hisotrSentWorkHour.ShowDataOnGrid
}
