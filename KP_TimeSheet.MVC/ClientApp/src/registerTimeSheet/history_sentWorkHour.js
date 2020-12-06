const common = require('../common/common');
const data = require('./data');
const history=require('./hisotory_workHour');
const common_register = require('./common');

//______________________نمایش کارکرد های ارسال شده

function init(){
	$('#btnMonitorSent').off().on('click',function(){
        GetWorkHours_MonitorSentWorkHour();
	});
	
	$('#GrdMonitorSentWorkHour_Hide').off().on('click',function(){
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


	var prmData = JSON.stringify(data.timeSheetData_get()[0].values);

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

	history.Create_GrdHistory();
	history.HideHistory();
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
		open: common_register.adjustSize,
	}).data("kendoWindow").center().open();

	$("#GrdMonitorSentWorkHour").kendoGrid({
		dataSource: {
			transport: {
				read: function (e) {
					e.success(_MonitorSentWorkHours)
				}
			},
			pageSize: 10
		},
		height: 450,
		pageable: true,
		filterable: true,
		selectable: true,

		columns: [{
			field: "PersianDate",
			title: "تاریخ"
		},
		{
			field: "ProjectTitle",
			title: "پروژه"
		}, {
			field: "TaskTitle",
			title: "وظیفه"
		}, {
			field: "Hours",
			title: "ساعت کار",
			width: 80

		}, {
			field: "WorkFlowStageTitle",
			title: "عنوان مرحله",
			width: 200
		}
			, {
			title: "نمایش تاریخچه   ",
			template: "<button   onclick='Init_GRDHistory(this)' type='button' class='btn btn-primary btn-sm' name='info' title='نمایش تاریخچه' > نمایش تاریخچه</button>",
			headerTemplate: "<label class='text-center'> نمایش تاریخچه </label>",
			filterable: false,
			sortable: false,
			width: 100
		}
		]

	});
}

function Refresh_GrdMonitorSentWorkHour() {
	var prmData = JSON.stringify(data.timeSheetData_get()[0].values);
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

function ShowCurrentDaySendWorkHours(SaveWHsIdx) {
	common.LoaderShow();
	history.Create_GrdHistory();

	var ktrlTimeSheets = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($("#" + SaveWHsIdx).closest("tr"));
	data.selDate_set(ktrlTimeSheets.values[parseInt($("#" + SaveWHsIdx).attr('dayindex')) - 3]);

	var workHourJson = {
		ID: null,
		Date: data.selDate_get().date
	}
debugger;
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

			common.LoaderHide();
		},
		error: function (e) {
			var a=e;
		}
	});


}

module.exports = {
	'Refresh_GrdMonitorSentWorkHour': Refresh_GrdMonitorSentWorkHour,
	'Init_GrdMonitorSentWorkHour': Init_GrdMonitorSentWorkHour,
	'init':init,
	'ShowCurrentDaySendWorkHours': ShowCurrentDaySendWorkHours
}
