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

const timeSheet = (function () {

    function timeSheet_Row(id, parentId, title, type, uid, values) {
        this.id = id;
        this.parentId = parentId;
        this.title = title;
        this.type = type;
        this.uid = uid;
        this.UID = uid;
        this.uuiidd = uid;
        this.values = values;
    }

    function timeSheet_Time(date, persianDate, persianDay, projects) {
        this.date = date;
        this.persianDate = persianDate;
        this.persianDay = persianDay;
        this.projects = projects;
    }
    timeSheet_Time.prototype.calcTime = function () {
        var sum = 0;
        for (var i = 0; i < this.projects.length; i++) {
            sum += this.projects[i].calcTime();
        }
        return sum;
    }


    function timeSheet_Prject(id, title, workouts) {
        this.id = id;
        this.title = title;
        this.workouts = workouts;
    }
    timeSheet_Prject.prototype.calcTime = function () {
        var sum = 0;
        for (var i = 0; i < this.workouts.length; i++) {
            sum += this.workouts[i].hours;
        }
        return sum;
    }


    function timeSheet_Workout(id, title, hours, state) {
        this.id = id;
        this.title = title;
        this.hours = hours;
        this.state = state;
    }

    function convertNumberToTime(number) {
        if (!number) return '0:00';
        const hour = parseInt(number);
        const minut = Math.round((number - hour) * 60);
        return `${hour}:${minut > 9 ? minut : '0' + minut}`;
    }

    function convertServerDataToTimeSheet_baseInfo(response, createItemForWantApprove) {
        const data = [];

        const hozoor = new timeSheet_Row(1, null, "حضور", "-", "eb96abcb-d37d-4aa1-1001-e1f4a753bee5", []);
        data.push(hozoor);

        const karkard = new timeSheet_Row(2, null, "کارکرد", "-", "eb96abcb-d37d-4aa1-1002-e1f4a753bee5", []);
        data.push(karkard);

        const projects = [];
        const times = private_findTimesAndProjects(response, hozoor, karkard, projects, null);

        private_addDailyTimes(data, times, projects, 2);

        if (!createItemForWantApprove) return data;

        debugger;

        const taeedNashodeId = data.length + 1
        const karkard_notApprove = new timeSheet_Row(taeedNashodeId, null, "تایید نشده", "-", "eb96abcb-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_notApprove);

        const projects_notApprove = [];
        const times_notApprove = private_findTimesAndProjects(response, null, karkard_notApprove, projects_notApprove, "TaskNotApprove");

        private_addDailyTimes(data, times_notApprove, projects_notApprove, taeedNashodeId, true);

        return data;
    }

    function private_addDailyTimes(data, times, projects, parentId, isApprove) {

        const rowProjects = [];
        for (var i = 0; i < projects.length; i++) {
            const proj = projects[i];
            const pId = data.length + 1;
            var p = new timeSheet_Row(pId, parentId, proj.title, "Project", proj.id, []);
            data.push(p);
            rowProjects.push(p);

            p.workouts = [];

            for (var j = 0; j < proj.workouts.length; j++) {
                const workout = proj.workouts[j];
                var w = new timeSheet_Row(data.length + 1, pId, workout.title, isApprove ? workout.state : "Workout", workout.id, []);
                data.push(w);
                p.workouts.push(w)
            }
        }

        times.forEach(t => {

            rowProjects.forEach(r => {

                var i = t.projects.findIndex(p => r.uid == p.id);

                var newItem = {
                    date: t.date,
                    persianDate: t.persianDate,
                    title: t.persianDate,
                    value: convertNumberToTime(0)
                };
                r.workouts.forEach(w => {
                    const newItemForW = { ...newItem };
                    w.values.push(newItemForW);

                    if (i > -1) {
                        var wwIndex = t.projects[i].workouts.findIndex(ww => ww.id == w.uid);
                        if (wwIndex > -1) newItemForW.value = convertNumberToTime(t.projects[i].workouts[wwIndex].hours);
                    }

                })

                if (i > -1) {
                    newItem.value = convertNumberToTime(t.projects[i].calcTime());
                }

                r.values.push(newItem);

            });
        });
    }



    function private_findTimesAndProjects(response, hozoor, karkard, projects, wantedState) {

        const times = [];

        for (let i = 0; i < response.length; i++) {
            const dbTime = response[i];
            const cTime = new timeSheet_Time(dbTime.date, dbTime.date_persian, dbTime.day_persian, []);
            times.push(cTime);

            for (let j = 0; j < dbTime.projects.length; j++) {
                const dbProject = dbTime.projects[j];
                const cProject = new timeSheet_Prject(dbProject.id, dbProject.title, []);


                let pIndex = projects.findIndex(p => p.id == cProject.id);
                let savedProject;
                if (pIndex == -1) {
                    savedProject = { id: cProject.id, title: cProject.title, workouts: [] };
                    projects.push(savedProject);
                } else {
                    savedProject = projects[pIndex];
                }

                for (let k = 0; k < dbProject.workouts.length; k++) {
                    const dbWorkout = dbProject.workouts[k];
                    const cWorkout = new timeSheet_Workout(dbWorkout.id, dbWorkout.title, dbWorkout.hours, dbWorkout.state);

                    if (!wantedState || cWorkout.state == wantedState) {
                        cProject.workouts.push(cWorkout);
                        if (savedProject.workouts.findIndex(p => p.id == cWorkout.id) == -1) savedProject.workouts.push({ id: cWorkout.id, title: cWorkout.title, state: cWorkout.state, hours: cWorkout.hours });
                    }
                }

                if (cProject.workouts.length > 0) cTime.projects.push(cProject);

            }

            if (hozoor) hozoor.values.push({
                date: cTime.date,
                persianDate: cTime.persianDate,
                persianDay: cTime.persianDay,
                title: cTime.persianDate,
                value: convertNumberToTime(dbTime.hozoor)
            });
            karkard.values.push({
                date: cTime.date,
                persianDate: cTime.persianDate,
                persianDay: cTime.persianDay,
                title: cTime.persianDate,
                value: convertNumberToTime(cTime.calcTime())
            });
        }

        return times;
    }


    return {
        convertServerDataToTimeSheet_baseInfo: convertServerDataToTimeSheet_baseInfo
    }

})();

module.exports = {
    convertServerDataToTimeSheet_baseInfo: timeSheet.convertServerDataToTimeSheet_baseInfo
};
},{}],3:[function(require,module,exports){
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
	service.init(dataService, common_timeSheet);


	GetUsers();
	WndDeny_OnInit();
	WNDSelectPeriod_OnInit();

	$('#btnpreviousPeriodconfirm').off().on('click', function () {
		GetPreviousPeriodconfirm();
	});
	$('#btnSelectPeriodconfirm').off().on('click', function () {
		WNDSelectPeriod_OnOpen();
	});
	$('#btnNextPeriodconfirm').off().on('click', function () {
		GetNextPeriodconfirm();
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
	dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);
	var json = {
		userid: dataService.userId_get(),
		values: dataService.timeSheetDataConfirm_get()[0].values
	};

	var prmData = JSON.stringify(json);

	service.getTimeSheetsByUserId(prmData, (response) => {
		removeAndRecreateTreelisConfirmDiv();
		Init_TimeSheetTreeListConfirm(response);

		common.loaderHide();
	}, () => {
		alert("Error");
		common.loaderHide();
	})

}

function removeAndRecreateTreelisConfirmDiv() {

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

		service.getTimeSheetsByUserIdForFirstTime((response) => {
			
			Init_TimeSheetTreeListConfirm(response);
			InitMonthlyByProjectsGridConfirm();
			InitPeriodlyByProjectsGridConfirm();
			$("#DownSideTabsConfirm").show();
			$("#PeriodPanle").show();
			$("#ExportNavConfirm").show();
			common.loaderHide();
		})

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
				 class='pull-left btn btn-success btn-xs forFound_ApproveTask' style='margin-right:5px'><i class='fa fa-check-square'></i></button>` +
				`<button title='رد کارکرد' data-uid='${dataItem.uuiidd}' data-index='${index}' 
				 class='pull-left btn btn-warning btn-xs forFound_DenyTask' style='margin-left:5px'><i class='fa fa-times'></i></button>`;
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

function ktrlTimeSheetsConfirm_dataBound(e){
	$('.forFound_ApproveTask').off().on('click', function () {
		const uid = $(this).data("uid");
		const index =$(this).data("index");
		ApproveTask(uid,index);
	});
	$('.forFound_DenyTask').off().on('click', function () {
		const uid = $(this).data("uid");
		const index =$(this).data("index");
		DenyTask(uid,index);
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

	debugger;
	var prmData = JSON.stringify(data);

	service.approveWorkHour(prmData, (response) => {
		debugger;
		GetCurrentPeriodconfirm();
		if(response && response.message) common.notify(response.message, "success");
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
		if(response && response.message) common.notify(response.message, "success");
	});

}

function DenyTask(id, index) {

	dataService.selectedTaskIdForDeny_set(id);
	dataService.selectedIndexDorDeny_set(index);
	WndDeny_OnOpen()


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

		service.changeDisplayPeriodToWeeklyConfirm((response) => {

			removeAndRecreateTreelisConfirmDiv();
			Init_TimeSheetTreeListConfirm(response);
			InitMonthlyByProjectsGridConfirm();
			InitPeriodlyByProjectsGridConfirm();

			common.loaderHide();
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
		service.getTimeSheetsByDateAndNumberOfDayConfirm(prmData, (response) => {
			removeAndRecreateTreelisConfirmDiv();
			Init_TimeSheetTreeListConfirm(response);
			InitMonthlyByProjectsGridConfirm();
			InitPeriodlyByProjectsGridConfirm();
			common.loaderHide();
		});
	}

}

function GetPreviousPeriodconfirm() {
	common.loaderShow();

	dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);
	dataService.timeSheetDataConfirm_get()[0].values[0].UserId = dataService.userId_get();
	var prmData = JSON.stringify(dataService.timeSheetDataConfirm_get()[0].values[0]);

	service.getPreviousPeriodConfirm(prmData, (response) => {
		removeAndRecreateTreelisConfirmDiv();
		Init_TimeSheetTreeListConfirm(response);
		InitMonthlyByProjectsGridConfirm();
		InitPeriodlyByProjectsGridConfirm();

		common.loaderHide();
	});

}

function GetCurrentPeriodconfirm() {
	common.loaderShow();

	dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);
	dataService.timeSheetDataConfirm_get()[0].values[0].UserId = dataService.userId_get();
	var prmData = JSON.stringify(dataService.timeSheetDataConfirm_get()[0].values);

	service.getCurrentPeriodConfirm(prmData, (response) => {
		removeAndRecreateTreelisConfirmDiv();
		Init_TimeSheetTreeListConfirm(response);
		InitMonthlyByProjectsGridConfirm();
		InitPeriodlyByProjectsGridConfirm();

		common.loaderHide();
	});

}

function GetNextPeriodconfirm() {
	common.loaderShow();

	dataService.userId_set($("#kddlUsers").data("kendoDropDownList").dataItem($("#kddlUsers").data("kendoDropDownList").select()).id);
	dataService.timeSheetDataConfirm_get()[0].values[dataService.timeSheetDataConfirm_get()[0].values.length - 1].UserId = dataService.userId_get();
	var prmData = JSON.stringify(dataService.timeSheetDataConfirm_get()[0].values[dataService.timeSheetDataConfirm_get()[0].values.length - 1]);

	service.getNextPeriodConfirm(prmData, (response) => {
		removeAndRecreateTreelisConfirmDiv();
		Init_TimeSheetTreeListConfirm(response);
		InitMonthlyByProjectsGridConfirm();
		InitPeriodlyByProjectsGridConfirm();

		common.loaderHide();
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

},{"../common/common":1,"../common/timesheet":2,"./data":4,"./service":5}],4:[function(require,module,exports){
const dataM = (function () {

    const moduleData = {};

    


    function init() {
        moduleData._Users = [];
        moduleData._TimeSheetDataConfirm = [];
        moduleData.SelectedTaskIdForDeny = "";
        moduleData.SelectedIndexDorDeny = 0;
        moduleData._thisMonthdataConfirm = [];
        moduleData._UserId = "";
    }

    return {
        init: init,
        moduleData: moduleData,
    }

})();

module.exports = {
    init: dataM.init,

    'users_get': function () { return dataM.moduleData._Users; },
    'users_set': function (data) { dataM.moduleData._Users = data; },

    'timeSheetDataConfirm_get': function () { return dataM.moduleData._TimeSheetDataConfirm; },
    'timeSheetDataConfirm_set': function (data) { dataM.moduleData._TimeSheetDataConfirm = data; },

    'selectedTaskIdForDeny_get': function () { return dataM.moduleData.SelectedTaskIdForDeny; },
    'selectedTaskIdForDeny_set': function (data) { dataM.moduleData.SelectedTaskIdForDeny = data; },

    'selectedIndexDorDeny_get': function () { return dataM.moduleData.SelectedIndexDorDeny; },
    'selectedIndexDorDeny_set': function (data) { dataM.moduleData.SelectedIndexDorDeny = data; },

    'thisMonthdataConfirm_get': function () { return dataM.moduleData._thisMonthdataConfirm; },
    'thisMonthdataConfirm_set': function (data) { dataM.moduleData._thisMonthdataConfirm = data; },

    'userId_get': function () { return dataM.moduleData._UserId; },
    'userId_set': function (data) { dataM.moduleData._UserId = data; },

};
},{}],5:[function(require,module,exports){
const service = (function () {

	const moduleData = {};

	function init(data,common_timeSheet) {
		moduleData.data = data;
		moduleData.common_timeSheet = common_timeSheet;
	}

	function getTimeSheetsByUserId(prmData, success_callBack, error_callBack) {

		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetTimeSheetsByUserId",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: (response) => {
				moduleData.data.timeSheetDataConfirm_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});

	}

	function getUsersInCurrentUserOrganisation(success_callBack, error_callBack) {

		$.ajax({
			type: "Get",
			url: "/api/TimeSheetsAPI/GetUsersInCurrentUserOrganisation",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (response) {
				moduleData.data.users_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});

	}

	function getTimeSheetsByUserIdForFirstTime(success_callBack, error_callBack) {

		$.ajax({
			type: "Get",
			url: "/api/Confirm/" + moduleData.data.userId_get(),
			contentType: "application/json; charset=utf-8",
			dataType: "json",

			success: function (response) {

				debugger;

				var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_baseInfo(response,true);


				moduleData.data.timeSheetDataConfirm_set(data);
				if (success_callBack) success_callBack(data);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});


		$.ajax({
			type: "Get",
			url: "/api/TimeSheetsAPI/GetTimeSheetsByUserIdForFirstTime?UserId=" + moduleData.data.userId_get(),
			contentType: "application/json; charset=utf-8",
			dataType: "json",

			success: function (response) {
				if (response) {
					response.forEach(element => {
						element.uuiidd = element.uid;
					});
				}
				//moduleData.data.timeSheetDataConfirm_set(response);
				//if (success_callBack) success_callBack(response);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	



	function approveWorkHour(prmData, success_callBack, error_callBack) {

		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/ApproveWorkHour",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function denyWorkHour(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/DenyWorkHour",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function getThisMonthDataByUser(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetThisMonthDataByUser",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: (response) => {
				moduleData.data.thisMonthdataConfirm_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function getThisMonthProjectsByUserID(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetThisMonthProjectsByUserID",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function getThisPeriodDataByUserId(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetThisPeriodDataByUserId",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function getThisPeriodProjectsByUserId(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetThisPeriodProjectsByUserId",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function changeDisplayPeriodToWeeklyConfirm(success_callBack, error_callBack) {
		$.ajax({
			type: "Get",
			url: "/api/TimeSheetsAPI/ChangeDisplayPeriodToWeeklyConfirm?UserId=" + moduleData.data.userId_get(),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (response) => {
				moduleData.data.timeSheetDataConfirm_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function getTimeSheetsByDateAndNumberOfDayConfirm(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetTimeSheetsByDateAndNumberOfDayConfirm",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: (response) => {
				moduleData.data.timeSheetDataConfirm_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}


	function getPreviousPeriodConfirm(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetPreviousPeriodConfirm",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: (response) => {
				moduleData.data.timeSheetDataConfirm_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function getCurrentPeriodConfirm(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetCurrentPeriodConfirm",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: (response) => {
				moduleData.data.timeSheetDataConfirm_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function getNextPeriodConfirm(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetNextPeriodConfirm",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: (response) => {
				moduleData.data.timeSheetDataConfirm_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}


	return {
		init: init,
		getTimeSheetsByUserId: getTimeSheetsByUserId,
		getUsersInCurrentUserOrganisation: getUsersInCurrentUserOrganisation,
		getTimeSheetsByUserIdForFirstTime: getTimeSheetsByUserIdForFirstTime,
		approveWorkHour: approveWorkHour,
		denyWorkHour: denyWorkHour,
		getThisMonthDataByUser: getThisMonthDataByUser,
		getThisMonthProjectsByUserID: getThisMonthProjectsByUserID,
		getThisPeriodDataByUserId: getThisPeriodDataByUserId,
		getThisPeriodProjectsByUserId: getThisPeriodProjectsByUserId,
		changeDisplayPeriodToWeeklyConfirm: changeDisplayPeriodToWeeklyConfirm,
		getTimeSheetsByDateAndNumberOfDayConfirm: getTimeSheetsByDateAndNumberOfDayConfirm,
		getPreviousPeriodConfirm: getPreviousPeriodConfirm,
		getCurrentPeriodConfirm: getCurrentPeriodConfirm,
		getNextPeriodConfirm: getNextPeriodConfirm
	}

})();

module.exports = {
	init: service.init,
	getTimeSheetsByUserId: service.getTimeSheetsByUserId,
	getUsersInCurrentUserOrganisation: service.getUsersInCurrentUserOrganisation,
	getTimeSheetsByUserIdForFirstTime: service.getTimeSheetsByUserIdForFirstTime,
	approveWorkHour: service.approveWorkHour,
	denyWorkHour: service.denyWorkHour,
	getThisMonthDataByUser: service.getThisMonthDataByUser,
	getThisMonthProjectsByUserID: service.getThisMonthProjectsByUserID,
	getThisPeriodDataByUserId: service.getThisPeriodDataByUserId,
	getThisPeriodProjectsByUserId: service.getThisPeriodProjectsByUserId,
	changeDisplayPeriodToWeeklyConfirm: service.changeDisplayPeriodToWeeklyConfirm,
	getTimeSheetsByDateAndNumberOfDayConfirm: service.getTimeSheetsByDateAndNumberOfDayConfirm,
	getPreviousPeriodConfirm: service.getPreviousPeriodConfirm,
	getCurrentPeriodConfirm: service.getCurrentPeriodConfirm,
	getNextPeriodConfirm: service.getNextPeriodConfirm
}
},{}]},{},[3]);
