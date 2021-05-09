// const data = require('./data');
// const common_register = require('./common');

//اون دکمه بالا سمت راست  ویرایش دوره جاری
//____________ویرایش
const editWorkHour = (function () {

	const moduleData = {};

	function init(mainGrid, common, common_register, data, common_timeSheet, service, createNewWorkHour) {
		moduleData.mainGrid = mainGrid;
		moduleData.common = common;
		moduleData.common_register = common_register;
		moduleData.data = data;
		moduleData.common_timeSheet = common_timeSheet;
		moduleData.service = service;
		moduleData.createNewWorkHour = createNewWorkHour;

		$('#btnEditWorkHour').off().on('click', function () {
			WndEditWorkHours_OnInit();
		});

		$('#btn_Close_WndEditWorkHours').off().on('click', function () {
			Close_WndEditWorkHours();
		});

	}

	function WndEditWorkHours_OnInit() {
		GetWorkHours_GrdEditWorkHour();

		moduleData.common.openWindow('WndEditWorkHours');
	}

	function Close_WndEditWorkHours() {
		$("#WndEditWorkHours").data("kendoWindow").close()
	}

	function GetWorkHours_GrdEditWorkHour(dontInit) {

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

				if(!dontInit){
					Init_GrdEditWorkHour();
				}else{
					var g = $("#GrdEditWorkHour").data("kendoGrid");
					if (g) g.dataSource.read();
				}
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
						var data  = moduleData.data.workHours_get();
						e.success(moduleData.data.workHours_get());
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
				field: "time",
				title: "ساعت کار ثبت شده    "
			},


			{
				title: "حذف ",
				template: "<button  type='button' class='btn btn-success btn-sm forFound_EditWorkHourEditGrid' title='حذف' name='edit' >ویرایش</button> "+
						"<button style='margin-right: 2px;'  type='button' class='btn btn-danger btn-sm forFound_DeleteWorkHourEditGrid' title='حذف' name='delete' >حذف</button>",
				headerTemplate: "<label class='text-center'> حذف </label>",
				filterable: false,
				sortable: false,
				width: 140
			},
			],
			dataBound: GrdEditWorkHour_DataBound

		});
	}

	


	function GrdEditWorkHour_DataBound(e) {
		$('.forFound_DeleteWorkHourEditGrid').off().on('click', function () {
			DeleteWorkHourEditGrid(this);
		});

		$('.forFound_EditWorkHourEditGrid').off().on('click', function () {
			editWorkout(this);
		});
	}

	function DeleteWorkHourEditGrid(e) {

		var grid = $("#GrdEditWorkHour").data("kendoGrid");
		var dataItem = grid.dataItem($(e).closest("tr"));


		moduleData.common.loaderShow();

		moduleData.service.deleteWorkHour(dataItem.id,()=>{
				moduleData.mainGrid.RefreshTimeSheet();
				moduleData.common.loaderHide();
		});
	}

	function editWorkout(e){
		var grid = $("#GrdEditWorkHour").data("kendoGrid");
		var dataItem = grid.dataItem($(e).closest("tr"));

		var dayTime;

		var timeSheetData = moduleData.data.timeSheetData_get();
		for(var key in timeSheetData[0].values){
			var time = timeSheetData[0].values[key];
			if(time.persianDate == dataItem.persianDate){
					dayTime = time;
					break;
			}
		}

		debugger;

		moduleData.createNewWorkHour.kwndSaveWHs_OnInit_ForEdit(
			dayTime, 
			dataItem.projectID, dataItem.taskID, dataItem.time, dataItem.id, dataItem.description);
	}

	function Refresh_GrdEditWorkHour() {
		GetWorkHours_GrdEditWorkHour(true);
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