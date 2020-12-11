(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const common = (function () {
	function doExport(selector, params) {
		var options = {
			//ignoreRow: [1,11,12,-2],
			//ignoreColumn: [0,-1],
			tableName: 'Countries',
			worksheetName: 'Countries by population'
		};

		$.extend(true, options, params);

		$(selector).tableExport(options);
	}

	function notify(messege, type) {
		$.notify({
			//icon: 'glyphicon glyphicon-warning-sign',
			//title: 'Bootstrap notify',
			message: "<strong >" + messege + "</strong>",
			//url: 'https://github.com/mouse0270/bootstrap-notify',
			//target: '_blank'
		}, {
			// settings
			//element: 'body',
			//position: null,
			type: type,
			allow_dismiss: false,
			//newest_on_top: false,
			//showProgressbar: true,
			placement: {
				from: "top",
				align: "left"
			},
			offset: 20,
			spacing: 10,
			z_index: 10100,
			delay: 1000,
			timer: 1000,
			//url_target: '_blank',
			//mouse_over: null,
			animate: {
				enter: 'animated fadeInDown',
				exit: 'animated fadeOutUp'
			},
			//onShow: null,
			//onShown: null,
			//onClose: null,
			//onClosed: null,
			//icon_type: 'class',
			// template: "<div style='height:15px;width:20%' class='shadow' >" + messege + "</div>"
		});
	}

	function loaderShow() {
		$("#Loader").fadeIn(500);
	}

	function loaderHide() {
		$("#Loader").fadeOut(500);
	}


	function adjustSize() {
		// For small screens, maximize the window when it is shown.
		// You can also make the check again in $(window).resize if you want to
		// but you will have to change the way to reference the widget and then
		// to use $("#theWindow").data("kendoWindow").
		// Alternatively, you may want to .center() the window.

		if ($(window).width() < 800 || $(window).height() < 600) {
			this.maximize();
		}
	}

	return {
		loaderShow: loaderShow,
		loaderHide: loaderHide,
		Notify: notify,
		DoExport: doExport,
		adjustSize: adjustSize

	};

})();


module.exports = {
	'loaderShow': common.loaderShow,
	'loaderHide': common.loaderHide,
	'notify': common.Notify,
	'doExport': common.DoExport,
	'adjustSize': common.adjustSize
};

},{}],2:[function(require,module,exports){
const common = require('../common/common');

var _Users = [];
var _TimeSheetDataConfirm = [];
var SelectedTaskIdForDeny = "";
var SelectedIndexDorDeny = 0;
var _thisMonthdataConfirm = [];
var _UserId = "";
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
	GetUsers();
	WndDeny_OnInit();
	WNDSelectPeriod_OnInit()


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
		width: "600px",
		height: "290px",
		scrollable: false,
		visible: false,
		modal: true,
		actions: [
			"Pin",
			"Minimize",
			"Maximize",
			"Close"
		],
		open: common.adjustSize,
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
		width: "380px",
		height: "290px",
		scrollable: false,
		visible: false,
		modal: true,
		actions: [
			"Pin",
			"Minimize",
			"Maximize",
			"Close"
		],
		open: common.adjustSize,
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
	_UserId = $("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).ID;
	var json = {
		userid: _UserId,
		values: _TimeSheetDataConfirm[0].Values

	}
	var prmData = JSON.stringify(json);
	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/GetTimeSheetsByUserId",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,
		success: function (response) {

			_TimeSheetDataConfirm = response;
			removeAndRecreateTreelisConfirmDiv();
			Init_TimeSheetTreeListConfirm(_TimeSheetDataConfirm);

			common.loaderHide();
		},
		error: function (e) {
			alert("Error")
		}
	});
}

function removeAndRecreateTreelisConfirmDiv() {

	$("#ktrlTimeSheetsConfirm").data("kendoTreeList").destroy();
	$("#ktrlTimeSheetsConfirm").remove();
	$("#KTLContainerRegisterConfirm").append("<div id='ktrlTimeSheetsConfirm'></div>");
}
function GetUsers() {
	$.ajax({
		type: "Get",
		url: "/api/TimeSheetsAPI/GetUsersInCurrentUserOrganisation",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (response) {
			_Users = response;
			$("#kddlUsers").kendoDropDownList({
				dataTextField: "FullName",
				dataValueField: "ID",
				filter: "contains",
				optionLabel: {
					FullName: "انتخاب کاربر . . . ",
					ID: ""
				},
				dataSource: {
					transport: {
						read: function (e) {
							e.success(_Users);
						}
					}
				},
				index: 0,
				change: kddlUsers_OnChange
			});
		},
		error: function (e) {


		}
	});
}

function kddlUsers_OnChange(e) {

	common.loaderShow();
	_UserId = $("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).ID;

	if (_UserId != "") {
		$.ajax({
			type: "Get",
			url: "/api/TimeSheetsAPI/GetTimeSheetsByUserIdForFirstTime?UserId=" + _UserId,
			contentType: "application/json; charset=utf-8",
			dataType: "json",

			success: function (response) {
				_TimeSheetDataConfirm = response;
				Init_TimeSheetTreeListConfirm(_TimeSheetDataConfirm);
				InitMonthlyByProjectsGridConfirm();
				InitPeriodlyByProjectsGridConfirm();
				$("#DownSideTabsConfirm").show();
				$("#PeriodPanle").show();
				$("#ExportNavConfirm").show();
				common.loaderHide();

				common.loaderHide();
			},
			error: function (e) {

			}
		});
	} else {
		common.notify("کاربری انتخاب نشده ", "warning")
	}


}

function Init_TimeSheetTreeListConfirm(data) {

	var ktrlTSColumnsConfirm = ktrlTimeSheetsConfirm_OnInitColumns(data);
	var counter = 0;
	var lenth = data[0].Values.length;

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

	colTitle.field = "Title";
	colTitle.title = "عنوان";
	colTitle.hidden = false;
	colTitle.width = 150;
	columns.push(colTitle);

	// این تابع آرایه از متد های مربوطه ایجاد می کند
	// فقط باید ایندکس ها توجه شود
	var templateFunctions = CreateTemplateColumnsFunction();
	///-----------------------------------------------------------------

	for (var i = 0; i < response[0].Values.length; i++) {

		var tsDate = response[0].Values[i];
		var colDate = new KTRColumnConfirm();
		colDate.field = "Values[" + i + "].Value";
		colDate.title = tsDate.Title;
		colDate.headerTemplate = "<h6><b>" + tsDate.PersianDate + "</b></h6><h6>" + tsDate.PersianDay + "</h6>";
		colDate.hidden = false;
		//تخصیص متد به تپلیت فقط باید ایندکس ها تنظیم گرددند
		colDate.template = templateFunctions[i];
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

	if (index < dataItem.Values.length) {
		if (dataItem.Values[index].Value != "0:00" && dataItem.Type == "TaskNotApprove" && dataItem.Values[index].Value != "") {
			return dataItem.Values[index].Value +
				"<button title='تایید کارکرد' onClick='ApproveTask(\"" +
				dataItem.UID + "\"," + index + ")' class='pull-left btn btn-success btn-xs' style='margin-right:5px'><i class='fa fa-check-square'></i></button>" +
				"<button title='رد کارکرد' onClick='DenyTask(\"" +
				dataItem.UID + "\"," + index + ")' class='pull-left btn btn-warning btn-xs' style='margin-left:5px'><i class='fa fa-times'></i></button>";
		}
		else {
			if (dataItem.Values[index].Value == "0:00") {
				return "<b class='text-warning'>" + dataItem.Values[index].Value + " </b>"
			}
			else if (dataItem.Values[index].Value == "") {
				return "<b class='text-warning'> </b>"
			}
			else {
				return "<b>" + dataItem.Values[index].Value + " </b>"
			}
		}
	} else {
		return "";
	}

}

function TreeListTemplateColmn0(dataItem) {
	return TreeListTemplateColumn(dataItem, 0);
}

function TreeListTemplateColmn1(dataItem) {
	return TreeListTemplateColumn(dataItem, 1);
}

function TreeListTemplateColmn2(dataItem) {
	return TreeListTemplateColumn(dataItem, 2);
}

function TreeListTemplateColumn3(dataItem) {
	return TreeListTemplateColumn(dataItem, 3);
}

function TreeListTempalteColumn4(dataItem) {
	return TreeListTemplateColumn(dataItem, 4);
}

function TreeListTemplateColumn5(dataItem) {
	return TreeListTemplateColumn(dataItem, 5);
}

function TreeListTemplateColumn6(dataItem) {
	return TreeListTemplateColumn(dataItem, 6);
}

function TreeListTemplateColumn7(dataItem) {
	return TreeListTemplateColumn(dataItem, 7);
}

function TreeListTemplateColumn8(dataItem) {
	return TreeListTemplateColumn(dataItem, 8);
}

function TreeListTemplateColumn9(dataItem) {
	return TreeListTemplateColumn(dataItem, 9);
}

function TreeListTemplateColumn10(dataItem) {
	return TreeListTemplateColumn(dataItem, 10);
}

function TreeListTemplateColumn11(dataItem) {
	return TreeListTemplateColumn(dataItem, 11);
}

function TreeListTemplateColumn12(dataItem) {
	return TreeListTemplateColumn(dataItem, 12);
}

function TreeListTemplateColumn13(dataItem) {
	return TreeListTemplateColumn(dataItem, 13);
}

function TreeListTemplateColumn14(dataItem) {
	return TreeListTemplateColumn(dataItem, 14);
}

function TreeListTemplteColumn15(dataItem) {
	return TreeListTemplateColumn(dataItem, 15);
}

function TreeListTemplateColumn16(dataItem) {
	return TreeListTemplateColumn(dataItem, 16);
}

function TreeListTemplateColumn17(dataItem) {
	return TreeListTemplateColumn(dataItem, 17);
}

function TreeListTemplateColumn18(dataItem) {
	return TreeListTemplateColumn(dataItem, 18);
}

function TreeListTemplatecolumn19(dataItem) {
	return TreeListTemplateColumn(dataItem, 19);
}

function TreeListTemplateColumn20(dataItem) {
	return TreeListTemplateColumn(dataItem, 20);
}

function TreeListTemplateColumn21(dataItem) {
	return TreeListTemplateColumn(dataItem, 21);
}

function TreeListTemplateColumn22(dataItem) {
	return TreeListTemplateColumn(dataItem, 22);
}

function TreeListTemplateColumn23(dataItem) {
	return TreeListTemplateColumn(dataItem, 23);
}

function TreeListTemplateColumn24(dataItem) {
	return TreeListTemplateColumn(dataItem, 24);
}

function TreeListTemplateColumn25(dataItem) {
	return TreeListTemplateColumn(dataItem, 25);
}

function TreeListTemplateColumn26(dataItem) {
	return TreeListTemplateColumn(dataItem, 26);
}

function TreeListTemplateColumn27(dataItem) {
	return TreeListTemplateColumn(dataItem, 27);
}

function TreeListTemplateColumn28(dataItem) {
	return TreeListTemplateColumn(dataItem, 28)
}

function TreeListTemplateColumn29(dataItem) {
	return TreeListTemplateColumn(dataItem, 29);
}

function TreeListTemplateColumn30(dataItem) {
	return TreeListTempalteColumn(dataItem, 30)
}

function CreateTemplateColumnsFunction() {

	var columns = [];
	columns.push(TreeListTemplateColmn0);
	columns.push(TreeListTemplateColmn1);
	columns.push(TreeListTemplateColmn2);
	columns.push(TreeListTemplateColumn3);
	columns.push(TreeListTempalteColumn4);
	columns.push(TreeListTemplateColumn5);
	columns.push(TreeListTemplateColumn6);
	columns.push(TreeListTemplateColumn7);
	columns.push(TreeListTemplateColumn9);
	columns.push(TreeListTemplateColumn8);
	columns.push(TreeListTemplateColumn10);
	columns.push(TreeListTemplateColumn11);
	columns.push(TreeListTemplateColumn12);
	columns.push(TreeListTemplateColumn13);
	columns.push(TreeListTemplateColumn14);
	columns.push(TreeListTemplteColumn15);
	columns.push(TreeListTemplateColumn16);
	columns.push(TreeListTemplateColumn17);
	columns.push(TreeListTemplateColumn18);
	columns.push(TreeListTemplatecolumn19);
	columns.push(TreeListTemplateColumn20);
	columns.push(TreeListTemplateColumn21);
	columns.push(TreeListTemplateColumn22);
	columns.push(TreeListTemplateColumn23);
	columns.push(TreeListTemplateColumn24);
	columns.push(TreeListTemplateColumn25);
	columns.push(TreeListTemplateColumn26);
	columns.push(TreeListTemplateColumn27);
	columns.push(TreeListTemplateColumn28);
	columns.push(TreeListTemplateColumn29);
	columns.push(TreeListTemplateColumn30);


	return columns;
}

function ApproveTask(id, index) {
	common.loaderShow();

	for (var i = 0; i < _TimeSheetDataConfirm.length; i++) {
		if (_TimeSheetDataConfirm[i].UID == id) {
			var da = _TimeSheetDataConfirm[i].Values[index];
		}
	}

	var data = {
		date: da.Date,
		id: id,
	};
	var prmData = JSON.stringify(data);
	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/ApproveWorkHour",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,
		success: function (response) {
			GetCurrentPeriodconfirm();
			common.notify(response, "success");

		},
		error: function (e) {

		}
	});


}

function FinalDeny() {

	common.loaderShow();

	for (var i = 0; i < _TimeSheetDataConfirm.length; i++) {
		if (_TimeSheetDataConfirm[i].UID == SelectedTaskIdForDeny) {
			var da = _TimeSheetDataConfirm[i].Values[SelectedIndexDorDeny];
		}
	}

	var data = {
		date: da.Date,
		id: SelectedTaskIdForDeny,
		description: $("#comment").val()
	};

	var prmData = JSON.stringify(data);
	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/DenyWorkHour",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,
		success: function (response) {
			WndDeny_OnClose();
			GetCurrentPeriodconfirm();
			common.notify(response, "success");


		},
		error: function (e) {

		}
	});


}

function DenyTask(id, index) {

	SelectedTaskIdForDeny = id;
	SelectedIndexDorDeny = index;
	WndDeny_OnOpen()


}

function InitMonthlyByProjectsGridConfirm() {

	_UserId = $("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).ID;

	var json = {
		value: _TimeSheetDataConfirm[0].Values[0],
		userid: _UserId
	}


	var prmData = JSON.stringify(json);
	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/GetThisMonthDataByUser",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,
		success: function (response) {

			_thisMonthdataConfirm = response;
			$("#MonthlyPresenceconfirmProgress").text(response.Presence);
			$("#MonthlyWorkHourconfirmProgress").text(response.Work);
			$("#MonthlyPresenceconfirm").width(response.Presencepercent);
			$("#MonthlyWorkHourconfirm").width(response.Workpercent);

			common.loaderHide();
		},
		error: function (e) {

		}
	});
	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/GetThisMonthProjectsByUserID",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,
		success: function (response) {

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
					field: "Title",
					title: "عنوان پروژه"
				}, {
					field: "Hour",
					title: "ساعت کار ثبت شده    "
				}]
			});

			$("#DownSideTabsConfirm").show();
		},
		error: function (e) {

		}
	});

}

function InitPeriodlyByProjectsGridConfirm() {
	_UserId = $("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).ID;
	var json = {
		values: _TimeSheetDataConfirm[0].Values,
		userid: _UserId
	}

	var prmData = JSON.stringify(json);

	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/GetThisPeriodDataByUserId",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,

		success: function (response) {

			$("#PeriodicallyPresenceconfirmProgress").text(response.Presence);
			$("#PeriodicallyWorkHourconfirmProgress").text(response.Work);
			$("#PeriodicallyPresenceconfirm").width(response.Presencepercent);
			$("#PeriodicallyWorkHourconfirm").width(response.Workpercent);
		},
		error: function (e) {

		}
	});

	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/GetThisPeriodProjectsByUserId",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,
		success: function (response) {
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
					field: "Title",
					title: "عنوان پروژه"
				}, {
					field: "Hour",
					title: "ساعت کار ثبت شده"
				}]
			})
		},
		error: function (e) {

		}
	});
}

function btnSendPeriodsconfirm_Onclick() {
	common.loaderShow();
	_UserId = $("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).ID;
	WNDSelectPeriod_OnClose()
	if ($('#chkweeklyconfirm').is(':checked')) {
		$.ajax({
			type: "Get",
			url: "/api/TimeSheetsAPI/ChangeDisplayPeriodToWeeklyConfirm?UserId=" + _UserId,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (response) {
				_TimeSheetDataConfirm = response;
				removeAndRecreateTreelisConfirmDiv();
				Init_TimeSheetTreeListConfirm(_TimeSheetDataConfirm);
				InitMonthlyByProjectsGridConfirm();
				InitPeriodlyByProjectsGridConfirm();


				common.loaderHide();
			},
			error: function (e) {

			}
		});
	}
	else {
		var PeriodJson = {
			Date: $("#startDateconfirm").val(),
			Days: $("#numberDaysconfirm").val(),
			IsWeekly: false,
			UserId: _UserId
		};

		var prmData = JSON.stringify(PeriodJson);

		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetTimeSheetsByDateAndNumberOfDayConfirm",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: function (response) {
				_TimeSheetDataConfirm = response;
				removeAndRecreateTreelisConfirmDiv();
				Init_TimeSheetTreeListConfirm(_TimeSheetDataConfirm);
				InitMonthlyByProjectsGridConfirm();
				InitPeriodlyByProjectsGridConfirm();
				common.loaderHide();
			},
			error: function (e) {

			}
		});
	}

}

function GetPreviousPeriodconfirm() {
	common.loaderShow();

	_UserId = $("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).ID;
	_TimeSheetDataConfirm[0].Values[0].UserId = _UserId;
	var prmData = JSON.stringify(_TimeSheetDataConfirm[0].Values[0]);

	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/GetPreviousPeriodConfirm",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,
		success: function (response) {

			_TimeSheetDataConfirm = response;
			removeAndRecreateTreelisConfirmDiv();
			Init_TimeSheetTreeListConfirm(_TimeSheetDataConfirm);
			InitMonthlyByProjectsGridConfirm();
			InitPeriodlyByProjectsGridConfirm();

			common.loaderHide();

		},
		error: function (e) {

		}
	});
}

function GetCurrentPeriodconfirm() {
	common.loaderShow();

	_UserId = $("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).ID;
	_TimeSheetDataConfirm[0].Values[0].UserId = _UserId;
	var prmData = JSON.stringify(_TimeSheetDataConfirm[0].Values);

	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/GetCurrentPeriodConfirm",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,
		success: function (response) {

			_TimeSheetDataConfirm = response;
			removeAndRecreateTreelisConfirmDiv();
			Init_TimeSheetTreeListConfirm(_TimeSheetDataConfirm);
			InitMonthlyByProjectsGridConfirm();
			InitPeriodlyByProjectsGridConfirm();

			common.loaderHide();

		},
		error: function (e) {

		}
	});
}

function GetNextPeriodconfirm() {
	common.loaderShow();

	_UserId = $("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).ID;
	_TimeSheetDataConfirm[0].Values[_TimeSheetDataConfirm[0].Values.length - 1].UserId = _UserId;
	var prmData = JSON.stringify(_TimeSheetDataConfirm[0].Values[_TimeSheetDataConfirm[0].Values.length - 1]);

	$.ajax({
		type: "Post",
		url: "/api/TimeSheetsAPI/GetNextPeriodConfirm",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: prmData,
		success: function (response) {

			_TimeSheetDataConfirm = response;
			removeAndRecreateTreelisConfirmDiv();
			Init_TimeSheetTreeListConfirm(_TimeSheetDataConfirm);
			InitMonthlyByProjectsGridConfirm();
			InitPeriodlyByProjectsGridConfirm();

			common.loaderHide();

		},
		error: function (e) {

		}
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

},{"../common/common":1}]},{},[2]);
