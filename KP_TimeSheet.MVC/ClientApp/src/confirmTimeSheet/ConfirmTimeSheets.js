const common = require('../common/common');
const service = require('./service');
const dataService = require('./data');
const common_timeSheet = require('../common/timesheet');


function KTRColumnConfirm() {
	this.field = "";
	this.title = "";
	this.template = "";
	this.hidden = false;
	this.width = 40;
	this.headerTemplate = "";
	this.filterable = false;
}

$(document).ready(function () {

	dataService.init();
	service.init(dataService, common_timeSheet, common);


	GetUsers();
	WndDeny_OnInit();
	WNDSelectPeriod_OnInit();

	$('#btnpreviousPeriodconfirm').off().on('click', function () {
		GetPreviousNextPeriodconfirm('previous');
	});
	$('#btnSelectPeriodconfirm').off().on('click', function () {
		WNDSelectPeriod_OnOpen();
	});
	$('#btnNextPeriodconfirm').off().on('click', function () {
		GetPreviousNextPeriodconfirm('next');
	});


	$('#btnSendPeriodconfirm').off().on('click', function () {
		btnSendPeriodsconfirm_Onclick();
	});
	$('#btnCancelconfirm').off().on('click', function () {
		WNDSelectPeriod_OnClose();
	});

	$('#btnDeny').off().on('click', function () {
		FinalDeny();
	});
	$('#btnDiscardDeny').off().on('click', function () {
		WndDeny_OnClose();
	});

});

$('input:radio[name="optradioconfirm"]').change(function () {

	EnableAndDisableSendPeriodRadioButtonConfirm(this);

});

$("#numberDaysconfirm").keyup(function () {

	if ($("#numberDaysconfirm").val() > 25) {
		$("#numberDaysconfirm").val("25");
	}
});

function WNDSelectPeriod_OnInit() {

	var kwndSendWHs = $("#kwndSelectTimePeriodConfirm");
	kwndSendWHs.kendoWindow({

		width: common.window_width(),
		height: common.window_height(),

		activate: common.addNoScrollToBody,
		deactivate: common.removeNoScrollToBody,

		scrollable: false,
		visible: false,
		modal: true,
		actions: [
			"Pin",
			"Minimize",
			"Maximize",
			"Close"
		],
		//open: common.adjustSize,
	}).data("kendoWindow").center();
}

function WNDSelectPeriod_OnOpen() {
	$("#kwndSelectTimePeriodConfirm").data("kendoWindow").open()
}

function WNDSelectPeriod_OnClose() {
	$("#kwndSelectTimePeriodConfirm").data("kendoWindow").close();
}

function WndDeny_OnInit() {
	var kwndDeny = $("#WndDeny");
	kwndDeny.kendoWindow({
		width: common.window_width(),
		height: common.window_height(),

		activate: common.addNoScrollToBody,
		deactivate: common.removeNoScrollToBody,

		scrollable: false,
		visible: false,
		modal: true,
		actions: [
			"Pin",
			"Minimize",
			"Maximize",
			"Close"
		],
		//open: common.adjustSize,
	}).data("kendoWindow").center();
}

function WndDeny_OnOpen() {

	$("#WndDeny").data("kendoWindow").open()

}

function WndDeny_OnClose() {
	$("#WndDeny").data("kendoWindow").close();
}

function RefreshTimeSheetConfirm() {
	common.loaderShow();

	service.getTimeSheetsByUserIdForFirstTime((response) => {

		private_Refresh(response);

	});

}

function private_Refresh(response) {
	removeAndRecreateTreelisConfirmDiv();

	Init_TimeSheetTreeListConfirm(response);
	InitMonthlyByProjectsGridConfirm();
	InitPeriodlyByProjectsGridConfirm();
	$("#DownSideTabsConfirm").show();
	$("#PeriodPanle").show();
	$("#ExportNavConfirm").show();
	common.loaderHide();
}

function removeAndRecreateTreelisConfirmDiv() {

	if (!$("#ktrlTimeSheetsConfirm").data("kendoTreeList")) return;
	$("#ktrlTimeSheetsConfirm").data("kendoTreeList").destroy();
	$("#ktrlTimeSheetsConfirm").remove();
	$("#KTLContainerRegisterConfirm").append("<div id='ktrlTimeSheetsConfirm'></div>");
}
function GetUsers() {

	service.getUsersInCurrentUserOrganisation((response) => {
		$("#kddlUsers").kendoDropDownList({
			dataTextField: "fullName",
			dataValueField: "id",
			filter: "contains",
			optionLabel: {
				fullName: "انتخاب کاربر . . . ",
				id: ""
			},
			dataSource: {
				transport: {
					read: function (e) {
						e.success(dataService.users_get());
					}
				}
			},
			index: 0,
			change: kddlUsers_OnChange
		});
	});
}

function kddlUsers_OnChange(e) {

	common.loaderShow();
	dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);

	if (dataService.userId_get() != "") {

		RefreshTimeSheetConfirm();

	} else {
		common.loaderHide();
		common.notify("کاربری انتخاب نشده ", "warning");
	}

}

function Init_TimeSheetTreeListConfirm(data) {

	var ktrlTSColumnsConfirm = ktrlTimeSheetsConfirm_OnInitColumns(data);
	var counter = 0;
	var lenth = data[0].values.length;

	$("#ktrlTimeSheetsConfirm").kendoTreeList({
		dataSource: {
			transport: {
				read: function (e) {
					e.success(data);
				},
			}
		},
		schema: {
			model: {
				id: "id",
				parentId: "parentId"
			}
		},
		expanded: true,
		selectable: true,
		height: 400,
		columns: ktrlTSColumnsConfirm,
		dataBound: ktrlTimeSheetsConfirm_dataBound
	});

}

function ktrlTimeSheetsConfirm_OnInitColumns(response) {

	var columns = [];

	var colId = new KTRColumn();
	colId.field = "id";
	colId.title = "شناسه";
	colId.hidden = true;
	colId.width = 10;
	columns.push(colId);

	var colParentId = new KTRColumnConfirm();
	colParentId.field = "parentId";
	colParentId.title = "شناسه پدر";
	colParentId.hidden = true;
	colParentId.width = 10;
	columns.push(colParentId);

	var colTitle = new KTRColumnConfirm();

	colTitle.field = "title";
	colTitle.title = "عنوان";
	colTitle.hidden = false;
	colTitle.width = 150;
	columns.push(colTitle);

	///-----------------------------------------------------------------

	for (var i = 0; i < response[0].values.length; i++) {

		const index = i;

		var tsDate = response[0].values[i];
		var colDate = new KTRColumnConfirm();
		colDate.field = "values[" + i + "].value";
		colDate.title = tsDate.title;
		colDate.headerTemplate = "<h6><b>" + tsDate.persianDate + "</b></h6><h6>" + tsDate.persianDay + "</h6>";
		colDate.hidden = false;
		//تخصیص متد به تپلیت فقط باید ایندکس ها تنظیم گرددند
		colDate.template = (dataItem) => TreeListTemplateColumn(dataItem, index);
		colDate.width = 50;
		columns.push(colDate);

	}
	return columns;
}

function KTRColumn() {
	this.field = "";
	this.title = "";
	this.template = "";
	this.hidden = false;
	this.width = 40;
	this.headerTemplate = "";
	this.filterable = false;
}

function TreeListTemplateColumn(dataItem, index) {

	if (index < dataItem.values.length) {
		if (dataItem.values[index].value != "0:00" && dataItem.type == "TaskNotApprove" && dataItem.values[index].value != "") {
			return dataItem.values[index].value +
				`<button title='تایید کارکرد' data-uid='${dataItem.uuiidd}' data-index='${index}' 
				 class='pull-left btn btn-success btn-xs forFound_ApproveTask' style='margin-right:5px;padding: 4px 4px 0;'><i class='glyphicon glyphicon-ok'></i></button>` +
				`<button title='رد کارکرد' data-uid='${dataItem.uuiidd}' data-index='${index}' 
				 class='pull-left btn btn-warning btn-xs forFound_DenyTask' style='margin-left:5px;padding: 4px 4px 0;'><i class='glyphicon glyphicon-remove'></i></button>`;
		}
		else {
			if (dataItem.values[index].value == "0:00") {
				return "<b class='text-warning'>" + dataItem.values[index].value + " </b>"
			}
			else if (dataItem.values[index].value == "") {
				return "<b class='text-warning'> </b>"
			}
			else {
				return "<b>" + dataItem.values[index].value + " </b>"
			}
		}
	} else {
		return "";
	}

}

function ktrlTimeSheetsConfirm_dataBound(e) {
	$('.forFound_ApproveTask').off().on('click', function () {
		const uid = $(this).data("uid");
		const index = $(this).data("index");
		ApproveTask(uid, index);
	});
	$('.forFound_DenyTask').off().on('click', function () {
		const uid = $(this).data("uid");
		const index = $(this).data("index");
		DenyTask(uid, index);
	});
}

function ApproveTask(id, index) {
	common.loaderShow();

	for (var i = 0; i < dataService.timeSheetDataConfirm_get().length; i++) {
		if (dataService.timeSheetDataConfirm_get()[i].uid == id) {
			var da = dataService.timeSheetDataConfirm_get()[i].values[index];
		}
	}

	var data = {
		date: da.date,
		id: id,
	};

	var prmData = JSON.stringify(data);

	service.approveWorkHour(prmData, (response) => {
		GetCurrentPeriodconfirm();
		if (response && response.message) common.notify(response.message, "success");
	});

}

function FinalDeny() {

	common.loaderShow();

	for (var i = 0; i < dataService.timeSheetDataConfirm_get().length; i++) {
		if (dataService.timeSheetDataConfirm_get()[i].uid == dataService.selectedTaskIdForDeny_get()) {
			var da = dataService.timeSheetDataConfirm_get()[i].values[dataService.selectedIndexDorDeny_get()];
		}
	}

	var data = {
		date: da.date,
		id: dataService.selectedTaskIdForDeny_get(),
		description: $("#comment").val()
	};

	var prmData = JSON.stringify(data);

	service.denyWorkHour(prmData, (response) => {
		WndDeny_OnClose();
		GetCurrentPeriodconfirm();
		if (response && response.message) common.notify(response.message, "success");
	});

}

function DenyTask(id, index) {

	dataService.selectedTaskIdForDeny_set(id);
	dataService.selectedIndexDorDeny_set(index);
	WndDeny_OnOpen()
}


function GetCurrentPeriodconfirm() {

	common.loaderShow();
	RefreshTimeSheetConfirm();
}


function InitMonthlyByProjectsGridConfirm() {

	dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);

	var json = {
		value: dataService.timeSheetDataConfirm_get()[0].values[0],
		userid: dataService.userId_get()
	}


	var prmData = JSON.stringify(json);
	service.getThisMonthDataByUser(prmData, (response) => {

		$("#MonthlyPresenceconfirmProgress").text(response.presence);
		$("#MonthlyWorkHourconfirmProgress").text(response.work);
		$("#MonthlyPresenceconfirm").width(response.presencepercent);
		$("#MonthlyWorkHourconfirm").width(response.workpercent);

		common.loaderHide();
	});

	service.getThisMonthProjectsByUserID(prmData, (response) => {
		$("#tblcurrmonthconfirm").kendoGrid({
			dataSource: {
				transport: {
					read: function (e) {
						e.success(response)
					}
				},
				pageSize: 20
			},
			height: 200,
			columns: [{
				field: "title",
				title: "عنوان پروژه"
			}, {
				field: "hour",
				title: "ساعت کار ثبت شده    "
			}]
		});

		$("#DownSideTabsConfirm").show();
	});

}

function InitPeriodlyByProjectsGridConfirm() {
	dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);
	var json = {
		values: dataService.timeSheetDataConfirm_get()[0].values,
		userid: dataService.userId_get()
	}

	var prmData = JSON.stringify(json);

	service.getThisPeriodDataByUserId(prmData, (response) => {
		$("#PeriodicallyPresenceconfirmProgress").text(response.presence);
		$("#PeriodicallyWorkHourconfirmProgress").text(response.work);
		$("#PeriodicallyPresenceconfirm").width(response.presencepercent);
		$("#PeriodicallyWorkHourconfirm").width(response.workpercent);
	});

	service.getThisPeriodProjectsByUserId(prmData, (response) => {
		$("#tblcurrperiodconfirm").kendoGrid({
			dataSource: {
				transport: {
					read: function (e) {
						e.success(response)
					}
				},
				pageSize: 20
			},
			height: 200,


			columns: [{
				field: "title",
				title: "عنوان پروژه"
			}, {
				field: "hour",
				title: "ساعت کار ثبت شده"
			}]
		});
	});

}

function btnSendPeriodsconfirm_Onclick() {
	common.loaderShow();
	dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);
	WNDSelectPeriod_OnClose()
	if ($('#chkweeklyconfirm').is(':checked')) {

		service.changeDisplayPeriodToWeeklyConfirm(() => {
			RefreshTimeSheetConfirm();
		});

	}
	else {
		var PeriodJson = {
			Date: $("#startDateconfirm").val(),
			Days: $("#numberDaysconfirm").val(),
			IsWeekly: false,
			UserId: dataService.userId_get()
		};

		var prmData = JSON.stringify(PeriodJson);
		service.changeDisplayPeriodToDaily(prmData, () => {
			RefreshTimeSheetConfirm();
		});
	}

}

function GetPreviousNextPeriodconfirm(type) {
	common.loaderShow();

	dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);

	let startDate = null;
	let endDate = null;

	if (type == 'previous') {
		startDate = dataService.timeSheetDataConfirm_get()[0].values[0].date;
	} else {
		var firstData = dataService.timeSheetDataConfirm_get()[0];
		endDate = firstData.values[firstData.values.length - 1].date;
	}

	service.getPreviousNextPeriodConfirm(dataService.userId_get(), startDate, endDate, (response) => {
		private_Refresh(response);
	});
}




function EnableAndDisableSendPeriodRadioButtonConfirm() {

	if ($("#numberDaysconfirm").is(':disabled')) {

		$("#numberDaysconfirm").prop("disabled", false);
		$("#startDateconfirm").prop("disabled", false);

	} else {
		$("#numberDaysconfirm").prop("disabled", true);
		$("#startDateconfirm").prop("disabled", true);
	}

}
