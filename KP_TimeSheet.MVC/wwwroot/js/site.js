(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const common = (function () {

	function version(){return "0.0.0.4";}

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
			showProgressbar: true,
			placement: {
				from: "bottom",
				align: "right"
			},
			offset: 20,
			spacing: 10,
			z_index: 10100,
			delay: 2000,
			timer: 500,
			//url_target: '_blank',
			mouse_over: 'pause',
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

	//info error success
	function ShowNotification(id, message, color) {

		//Initial kendoNotification
		$("#" + id).kendoNotification({
			position: {
				top: 150,
				left: 20
			},
			autoHideAfter: 10000,
			stacking: "down"
		});
		$("#" + id).getKendoNotification().show(message, color);
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

	//----------------------------------------------------------
	
	function window_width(){
		let w = $( window ).width();
		if(w>1000) w=1000;
		return w + "px";
	}
	function window_height(){
		return ($( window ).height() - 50) + "px";
	}
	function addNoScrollToBody(){
		$("body").addClass("ob-no-scroll");
		$(".k-widget.k-window").css('top',$("body").scrollTop()+5+'px');
	}
	function removeNoScrollToBody(){
		$("body").removeClass("ob-no-scroll");
	}

	return {
		loaderShow: loaderShow,
		loaderHide: loaderHide,
		Notify: notify,
		DoExport: doExport,
		adjustSize: adjustSize,

		window_height: window_height,
		window_width: window_width,

		addNoScrollToBody: addNoScrollToBody,
		removeNoScrollToBody: removeNoScrollToBody,

		version: version

	};

})();


module.exports = {
	'loaderShow': common.loaderShow,
	'loaderHide': common.loaderHide,
	'notify': common.Notify,
	'doExport': common.DoExport,
	'adjustSize': common.adjustSize,

	window_height: common.window_height,
	window_width: common.window_width,

	addNoScrollToBody: common.addNoScrollToBody,
	removeNoScrollToBody: common.removeNoScrollToBody,

	version:common.version
};

},{}],2:[function(require,module,exports){
const { RefreshTimeSheet } = require("../registerTimeSheet/mainGrid");

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
            sum += this.workouts[i].minutes;
        }
        return sum;
    }


    function timeSheet_Workout(id, title, minutes, state) {
        this.id = id;
        this.title = title;
        this.minutes = minutes;
        this.state = state;
    }

    function convertNumberToTime(mainNumber) {
        if (!mainNumber) return '0:00';

        var number = Math.abs(mainNumber);

        const hour = parseInt(number);
        const minut = Math.round((number - hour) * 60);
        return `${hour}:${minut > 9 ? minut : '0' + minut} ${mainNumber < 0 ? '-' : ''}`;
    }
    function convertMinutsToTime(mainNumber) {
        if (!mainNumber) return '0:00';

        var number = Math.abs(mainNumber);

        const hour = parseInt(number / 60);
        const minut = number - (hour * 60);
        return `${hour}:${minut > 9 ? minut : '0' + minut} ${mainNumber < 0 ? '-' : ''}`;
    }

    function convertClockTextToMinute(clock) {
        if (!clock) return 0;
        var array = clock.split(':');
        return array[0] * 60 + array[1] * 1;
    }



    function convertServerDataToTimeSheet_ForEmployee(response) {
        const data = [];

        const amaliat = new timeSheet_Row(0, null, "عملیات", "Amaliat", "11111111-d37d-4aa1-1000-e1f4a753bee5", []);
        data.push(amaliat);

        const hozoor = new timeSheet_Row(1, null, "حضور", "Hozoor", "22222222-d37d-4aa1-1001-e1f4a753bee5", []);
        data.push(hozoor);

        const hozoorDetail = new timeSheet_Row(2, 1, "جزئیات", "HozoorDetail", "33333333-d37d-4aa1-1002-e1f4a753bee5", []);
        data.push(hozoorDetail);


        //---------------------------------------------------
        const karkard = new timeSheet_Row(3, null, "کارکرد", "Karkard", "44444444-d37d-4aa1-1003-e1f4a753bee5", []);
        data.push(karkard);

        const diffHozoorKarkard = new timeSheet_Row(4, null, "اختلاف حضور و کارکرد", "Diff_Karkard_Hozoor", "55555555-d37d-4aa1-1004-e1f4a753bee5", []);
        data.push(diffHozoorKarkard);

        const projects = [];
        const times = private_findTimesAndProjects('work', response, hozoor, hozoorDetail, karkard, diffHozoorKarkard, projects, null);

        private_addProjectsAndTasksTimes(data, times, projects, 3);


        //-----------------------------------------------------------------------
        const notSendId = data.length + 1
        const karkard_notSend = new timeSheet_Row(notSendId, null, "ارسال نشده", "DontSend", "66666666-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_notSend);


        const projects_notSendByEmployee = [];
        const times_notSend = private_findTimesAndProjects('work', response, null, null, karkard_notSend, null, projects_notSendByEmployee, "Resource");

        if (projects_notSendByEmployee.length) {
            private_addProjectsAndTasksTimes(data, times_notSend, projects_notSendByEmployee, notSendId, true);
        } else data.pop();


        private_addTimesForAmaliat(hozoor, karkard_notSend, karkard, amaliat);


        // // // //--------------------------------------------------------------------------------
        // // // const onApprovingId = data.length + 1
        // // // const karkard_onApproving = new timeSheet_Row(onApprovingId, null, "در حال تایید", "OnApproving", "77777777-d37d-1001-0000-e1f4a753bee5", []);
        // // // data.push(karkard_onApproving);

        // // // const projects_approving = [];
        // // // const times_approve = private_findTimesAndProjects('work', response, null, null, karkard_onApproving, null, projects_approving, "Approving");

        // // // if(projects_approving.length){
        // // //     private_addProjectsAndTasksTimes(data, times_approve, projects_approving, onApprovingId, true);
        // // // }else data.pop();
        // // // //--------------------------------------------------------------------------------

        // // // const finalId = data.length + 1
        // // // const karkard_final = new timeSheet_Row(finalId, null, "تایید نهایی", "Final", "88888888-d37d-1001-0000-e1f4a753bee5", []);
        // // // data.push(karkard_final);

        // // // const projects_final = [];
        // // // const times_final = private_findTimesAndProjects('work', response, null, null, karkard_final, null, projects_final, "Final");

        // // // if(projects_final.length){
        // // //     private_addProjectsAndTasksTimes(data, times_final, projects_final, finalId, true);
        // // // }else data.pop();

        //---------------------------------------------------------------------------------

        const deniedId = data.length + 1
        const karkard_deny = new timeSheet_Row(deniedId, null, "رد شده", "Denied", "99999999-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_deny);

        const projects_deny = [];
        const times_deny = private_findTimesAndProjects('work', response, null, null, karkard_deny, null, projects_deny, "Denied");

        if (projects_deny.length) {
            private_addProjectsAndTasksTimes(data, times_deny, projects_deny, deniedId, true);
        } else data.pop();

        //---------------------------------------------------------------------------------


        const otherId = data.length + 1
        const karkard_other = new timeSheet_Row(otherId, null, "سایر", "Other", "10101010-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_other);

        const projects_other = [];
        const times_other = private_findTimesAndProjects('other', response, null, null, karkard_other, null, projects_other, null);

        if (projects_other.length) {
            private_addProjectsAndTasksTimes(data, times_other, projects_other, otherId, true);
        } else data.pop();

        //---------------------------------------------------------------------------------

        

        return data;
    }

    function private_addTimesForAmaliat(hozoor, noSend, mainKarkard, amalit) {
        //سه تا دکمه بالا را مشخص می کنه که باشه یا نه
        const times = [];

        for (let i = 0; i < hozoor.values.length; i++) {
            const hozoorTodayTime = hozoor.values[i];
            const nosendTodayTime = noSend.values[i];
            const mainKarkardTodayTime = mainKarkard.values[i];

            amalit.values.push({
                date: hozoorTodayTime.date,
                persianDate: hozoorTodayTime.persianDate,
                persianDay: hozoorTodayTime.persianDay,
                title: hozoorTodayTime.persianDate,
                value: { isOpen: hozoorTodayTime.isOpen, has_NotSendData: !!nosendTodayTime.minute, hasKarkard: !!mainKarkardTodayTime.minute }
            });

        }


    }

    function convertServerDataToTimeSheet_ForApprove(response) {
        const data = [];

        const hozoor = new timeSheet_Row(1, null, "حضور", "-", "eb96abcb-d37d-4aa1-1000-e1f4a753bee5", []);
        data.push(hozoor);

        const hozoorDetail = new timeSheet_Row(2, 1, "جزئیات", "-", "eb96abcb-d37d-4aa1-1001-e1f4a753bee5", []);
        data.push(hozoorDetail);

        const karkard = new timeSheet_Row(3, null, "کارکرد", "-", "eb96abcb-d37d-4aa1-1002-e1f4a753bee5", []);
        data.push(karkard);

        const projects = [];
        const times = private_findTimesAndProjects('work', response, hozoor, hozoorDetail, karkard, null, projects, null);

        private_addProjectsAndTasksTimes(data, times, projects, 3);

        //----------------------------------------------------------------------------
        const taeedNashodeId = data.length + 1
        const karkard_notApprove = new timeSheet_Row(taeedNashodeId, null, "تایید نشده", "-", "eb96abcb-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_notApprove);

        const projects_notApprove = [];
        const times_notApprove = private_findTimesAndProjects('work', response, null, null, karkard_notApprove, null, projects_notApprove, "TaskNotApprove");

        private_addProjectsAndTasksTimes(data, times_notApprove, projects_notApprove, taeedNashodeId, true);

        //----------------------------------------------------------------------------
        const otherId = data.length + 1
        const karkard_other = new timeSheet_Row(otherId, null, "سایر", "-", "eb96abcb-d37d-1005-0000-e1f4a753bee5", []);
        data.push(karkard_other);

        const projects_ohter = [];
        const times_other = private_findTimesAndProjects('ohter', response, null, null, karkard_other, null, projects_ohter, null);
        if (projects_ohter.length) {
            debugger;

            private_addProjectsAndTasksTimes(data, times_other, projects_ohter, otherId, true);

            //انتقال موارد تایید نشده که مستقیم زیرمجموعه سایر باشد
            const projectNotApprovedIndex = data.findIndex(p=>p.parentId==otherId && p.title=='TaskNotApprove');
            const projectNotApprovedId=data[projectNotApprovedIndex].id;

            const subApproveProjects = data.filter(p=> p.parentId==projectNotApprovedId);
            for(let i=0;i<subApproveProjects.length;i++){
                subApproveProjects[i].parentId = otherId;
            }
            data.splice(projectNotApprovedIndex,1);
            

            //عوض کردن عنوان موارد تایید شده
            const projectApprovedIndex = data.findIndex(p=>p.parentId==otherId && p.title=='Approved');
            if(projectApprovedIndex>-1) data[projectApprovedIndex].title = 'تایید شده';

        } else data.pop();



        return data;
    }

    function private_addProjectsAndTasksTimes(data, times, projects, parentId, isApprove) {

        if (projects.length == 0) return;

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
                    value: convertMinutsToTime(0)
                };
                r.workouts.forEach(w => {
                    const newItemForW = { ...newItem };
                    w.values.push(newItemForW);

                    if (i > -1) {
                        const f = t.projects[i].workouts.filter(ww => ww.id == w.uid);
                        let sum = 0;
                        for (var ii = 0; ii < f.length; ii++) {
                            sum += f[ii].minutes;
                        }
                        newItemForW.value = convertMinutsToTime(sum);
                    }

                })

                if (i > -1) {
                    newItem.value = convertMinutsToTime(t.projects[i].calcTime());
                }

                r.values.push(newItem);

            });
        });
    }



    function private_findTimesAndProjects(type, response, hozoor, hozoorDetail, karkard, diffHozoorKarkard, projects, wantedState) {

        const times = [];

        for (let i = 0; i < response.length; i++) {
            const dbTime = response[i];
            const cTime = new timeSheet_Time(dbTime.date, dbTime.date_persian, dbTime.day_persian, []);
            times.push(cTime);

            const dbProjects = type == "work" ? dbTime.projects : dbTime.others;

            for (let j = 0; j < dbProjects.length; j++) {
                const dbProject = dbProjects[j];
                const cProject = new timeSheet_Prject(dbProject.id, dbProject.title, []);


                let pIndex = projects.findIndex(p => p.id == cProject.id);
                let savedProject;
                let isNewSavedProject = false;
                if (pIndex == -1) {
                    savedProject = { id: cProject.id, title: cProject.title, workouts: [] };
                    isNewSavedProject = true;
                } else {
                    savedProject = projects[pIndex];
                }

                for (let k = 0; k < dbProject.workouts.length; k++) {
                    const dbWorkout = dbProject.workouts[k];

                    if (wantedState && dbWorkout.state != wantedState) continue;

                    let sumMinutes = dbWorkout.minutes;

                    // for (let k2 = k + 1; k2 < dbProject.workouts.length; k2++) {
                    //     const dbWorkout2 = dbProject.workouts[k2];
                    //     if (dbWorkout2.id == dbWorkout.id && (!wantedState || cWorkout2.state == wantedState)) {
                    //         sumMinutes += dbWorkout2.minutes;
                    //     }
                    // }

                    const cWorkout = new timeSheet_Workout(dbWorkout.id, dbWorkout.title, sumMinutes, dbWorkout.state);

                    cProject.workouts.push(cWorkout);

                    const index = savedProject.workouts.findIndex(p => p.id == cWorkout.id);
                    if (index == -1) {
                        savedProject.workouts.push({
                            id: cWorkout.id, title: cWorkout.title, state: cWorkout.state, minutes: sumMinutes
                        })
                    } else {
                        savedProject.workouts[index].minutes += sumMinutes;
                    }
                }

                if (cProject.workouts.length > 0) {
                    cTime.projects.push(cProject);
                    if (isNewSavedProject) projects.push(savedProject);
                }

            }

            if (hozoor) hozoor.values.push({
                date: cTime.date,
                persianDate: cTime.persianDate,
                persianDay: cTime.persianDay,
                title: cTime.persianDate,
                value: convertMinutsToTime(dbTime.hozoor),
                minute: dbTime.hozoor,
                isOpen: dbTime.isOpen
            });
            if (hozoorDetail) hozoorDetail.values.push({
                date: cTime.date,
                persianDate: cTime.persianDate,
                persianDay: cTime.persianDay,
                title: cTime.persianDate,
                value: dbTime.dayTimeString ? dbTime.dayTimeString : '-',
            });
            if (karkard) karkard.values.push({
                date: cTime.date,
                persianDate: cTime.persianDate,
                persianDay: cTime.persianDay,
                title: cTime.persianDate,
                value: convertMinutsToTime(cTime.calcTime()),
                minute: cTime.calcTime()
            });
            if (diffHozoorKarkard) diffHozoorKarkard.values.push({
                date: cTime.date,
                persianDate: cTime.persianDate,
                persianDay: cTime.persianDay,
                title: cTime.persianDate,
                value: convertMinutsToTime(dbTime.hozoor - cTime.calcTime()),
                minute: dbTime.hozoor - cTime.calcTime()
            });
        }

        return times;
    }

    function calcPercent(inputs, wanted) {

        if (wanted < 0) return 0;

        var max = 0;

        for (var k in inputs) {
            if (inputs[k] > max) max = inputs[k];
        }

        if (max < 6000) max = 6000;

        return 100 * wanted / max;
    }




    function foundExpandedTreeListTitle(treeList) {
        if (!treeList) return [];

        var rows = $("[aria-expanded=true]", treeList.tbody);

        var expandedRows = $.map(rows, function (row) {
            return $(row).children()[2].innerText;
        });

        return expandedRows;
    }
    function expandTreeListItems(treeList, expandedRowsTitle) {

        if (!treeList || !expandedRowsTitle || !expandedRowsTitle.length) return;

        var rows = $("tr.k-treelist-group", treeList.tbody);

        var co = 0;
        for (var k = 0; k < rows.length; k++) {
            var row = rows[k];
            if ($(row).children()[2] && $(row).children()[2].innerText == expandedRowsTitle[co]) {
                treeList.expand(row);
                co++;
                if (co >= expandedRowsTitle.length) break;
            }
        }

    }



    return {
        convertServerDataToTimeSheet_ForEmployee: convertServerDataToTimeSheet_ForEmployee,
        convertServerDataToTimeSheet_ForApprove: convertServerDataToTimeSheet_ForApprove,
        convertMinutsToTime: convertMinutsToTime,
        convertClockTextToMinute: convertClockTextToMinute,
        calcPercent: calcPercent,

        foundExpandedTreeListTitle: foundExpandedTreeListTitle,
        expandTreeListItems: expandTreeListItems
    }

})();

module.exports = {
    convertServerDataToTimeSheet_ForEmployee: timeSheet.convertServerDataToTimeSheet_ForEmployee,
    convertServerDataToTimeSheet_ForApprove: timeSheet.convertServerDataToTimeSheet_ForApprove,
    convertMinutsToTime: timeSheet.convertMinutsToTime,
    convertClockTextToMinute: timeSheet.convertClockTextToMinute,
    calcPercent: timeSheet.calcPercent,

    foundExpandedTreeListTitle: timeSheet.foundExpandedTreeListTitle,
    expandTreeListItems: timeSheet.expandTreeListItems
};
},{"../registerTimeSheet/mainGrid":4}],3:[function(require,module,exports){
const common = require('../common/common');
const commonTimesheet = require('../common/timesheet');

var _YesterdayData = [];
var _ThisMonthData = [];
common.loaderShow();

$(document).ready(function () {
    common.loaderShow();
    GetHomeData();
});

function GetHomeData() {

    $.ajax({
        type: "Get",
        url: `/api/TimeSheetsAPI/GetYesterdayData/${common.version()}`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: Page_OnInitYesterday,
        error: function (e) {

            if (e.responseText) {
                common.notify(e.responseText, 'danger');
                common.loaderHide();
            }

        }
    });


}

function Page_OnInitYesterday(response) {
    $.ajax({
        type: "Get",
        url: "/api/TimeSheetsAPI/GetThisMonthDataForHomePage",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: Page_OnInitThisMonth,
        error: function (e) {

        }
    });

    _YesterdayData = response;

    $("#UsenNameSidebar").text(response.currentUser);
    $("#currentUser").text(response.currentUser);

    const items = [response.presence, response.work, response.defference];
    const v1 = commonTimesheet.calcPercent(items, response.presence);
    const v2 = commonTimesheet.calcPercent(items, response.work);
    const v3 = commonTimesheet.calcPercent(items, response.defference);

    $("#PresenceYesterday").text(commonTimesheet.convertMinutsToTime(response.presence));
    $("#WorkYesterday").text(commonTimesheet.convertMinutsToTime(response.work));
    $("#differenceYesterday").text(commonTimesheet.convertMinutsToTime(response.defference));
    $("#PresenceYesterdaypercent").css('width', v1+'%').attr('aria-valuenow', v1);
    $("#workYesterdaypercent").css('width', v2+'%').attr('aria-valuenow', v2);
    $("#differentYesterdaypercent").css('width', v3+'%').attr('aria-valuenow', v3);

}

function Page_OnInitThisMonth(response) {
    _ThisMonthData = response

    const items = [response.presence, response.work, response.defference];
    const v1 = commonTimesheet.calcPercent(items, response.presence);
    const v2 = commonTimesheet.calcPercent(items, response.work);
    const v3 = commonTimesheet.calcPercent(items, response.defference);

    $("#PresenceThisMonth").text(commonTimesheet.convertMinutsToTime(response.presence));
    $("#WorkThisMonth").text(commonTimesheet.convertMinutsToTime(response.work));
    $("#differenceThisMonth").text(commonTimesheet.convertMinutsToTime(response.defference));
    $("#PresenceThisMonthpercent").css('width', v1+'%').attr('aria-valuenow', v1);
    $("#workThisMonthpercent").css('width', v2+'%').attr('aria-valuenow', v2);
    $("#differentThisMonthpercent").css('width', v3+'%').attr('aria-valuenow', v3);


    $.ajax({
        type: "Get",
        url: "/api/TimeSheetsAPI/GetWaitingForApproveSumTime",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: Page_OnInitWaitApprove,
        error: function (e) {

        }
    });

    common.loaderHide()

}

function Page_OnInitWaitApprove(response) {

    const items = [response.minutes];
    const v1 = commonTimesheet.calcPercent(items, response.minutes);

    $("#hoursWaitingToApprove").text(commonTimesheet.convertMinutsToTime(response.minutes));
    $("#hoursWaitingToApprovePercent").css('width', v1 + '%').attr('aria-valuenow', v1);

}

},{"../common/common":1,"../common/timesheet":2}],4:[function(require,module,exports){
const myMainGrid = (function () {

  const moduleData = {};

  function init(common, common_register, common_timeSheet, createNewWorkHour, history_sentWorkHour, sendWorkHour,
    data, service, editWindow, history_sentWorkHour, priodlyGrid, monthlyGrid) {

    moduleData.common = common;
    moduleData.common_register = common_register;
    moduleData.common_timeSheet = common_timeSheet;

    moduleData.data = data;
    moduleData.history_sentWorkHour = history_sentWorkHour;
    moduleData.createNewWorkHour = createNewWorkHour;
    moduleData.sendWorkHour = sendWorkHour;
    moduleData.service = service;

    moduleData.editWindow = editWindow;
    moduleData.history_sentWorkHour = history_sentWorkHour;

    moduleData.priodlyGrid = priodlyGrid;
    moduleData.monthlyGrid = monthlyGrid;

    moduleData.expandedRows = [];
  };

  function KTRColumn() {
    this.field = "";
    this.title = "";
    this.template = "";
    this.hidden = false;
    this.width = 40;
    this.headerTemplate = "";
    this.filterable = false;
  };


  //________________ جهت باز سازی TreeList اصلی

  function RefreshTimeSheet(reset = false) {
    moduleData.common.loaderShow();

    let fromDate = null;
    let toDate = null;
    if (!reset) {
      var prmData = moduleData.data.timeSheetData_get()[0].values;
      fromDate = prmData[0].date;
      toDate = prmData[prmData.length - 1].date;
    }
    GetTimeSheets(() => {
      ResetAllThings();

    }, fromDate, toDate);
  }

  function ResetAllThings() {

    var treeList = $("#ktrlTimeSheets").data("kendoTreeList");
    moduleData.expandedRows = moduleData.common_timeSheet.foundExpandedTreeListTitle(treeList);


    moduleData.common_register.removeAndRecreateTreelisDiv();

    moduleData.editWindow.Refresh_GrdEditWorkHour();
    moduleData.history_sentWorkHour.Refresh_GrdMonitorSentWorkHour();


    moduleData.priodlyGrid.InitPeriodlyByProjectsGrid();
    moduleData.monthlyGrid.InitMonthlyByProjectsGrid();

    moduleData.common.loaderHide();
  }
  //----------

  function GetTimeSheets(callBackFn, fromDate, toDate) {
    moduleData.service.getTimeSheets(fromDate, toDate, (response) => {
      if (callBackFn) callBackFn(response);
      Init_TimeSheetTreeList();
    });
  }

  function Init_TimeSheetTreeList() {

    const timeSheetData = moduleData.data.timeSheetData_get();
    const timeSheetData2 = timeSheetData.slice(1);

    var ktrlTSColumns = ktrlTimeSheets_OnInitColumns(timeSheetData);

    $("#ktrlTimeSheets").kendoTreeList({
      dataSource: {
        transport: {
          read: function (e) {
            e.success(timeSheetData2);
          },
        }
      },
      schema: {
        model: {
          id: "id",
          parentId: "parentId"
        }
      },
      height: 400,
      width: 'auto',
      columns: ktrlTSColumns,
      scrollable: true,
      selectable: true,
      dataBound: ktrlTimeSheets_DataBound
    });

    //تول تیپ درست کار نمی کرد برداشتم. جاش را اشتباه نشان می داد

    // var tooltip = $("#ktrlTimeSheets").kendoTooltip({
    //   filter: 'td',
    //   content: function (e) {
    //     var treelist = $("#ktrlTimeSheets").data("kendoTreeList");
    //     var targetRow = $(e.target).closest('tr');
    //     var dataItem = treelist.dataItem(targetRow);
    //     return dataItem.title;
    //   },
    //   position: "left",
    //   animation: {
    //     open: {
    //       effects: "zoom",
    //       duration: 150
    //     }
    //   }
    // }).data("kendoTooltip");

    $("#ktrlTimeSheets tbody").on("dblclick", "td", function (e) {

      var cell = $(e.currentTarget);
      var cellIndex = cell[0].cellIndex;
      var grid = $("#ktrlTimeSheets").data("kendoTreeList");
      var column = grid.columns[cellIndex];
      var dataItem = grid.dataItem(cell.closest("tr"));

      if (dataItem.type != 'Karkard' && dataItem.type != 'Project' && dataItem.type != 'Workout') return;

      if (cellIndex<3 || !dataItem.values) return;
      var sotoon = dataItem.values[cellIndex - 3];

      var timeSheetData = moduleData.data.timeSheetData_get();
      var dayTime = timeSheetData[0].values[cellIndex - 3];
      moduleData.data.selDate_set(dayTime);

      if (dataItem.type == 'Workout') {

        const items = [];
        const item = {};
        const taskId = dataItem.uuiidd;

        var parent = grid.dataSource.parentNode(dataItem);
        var projectId = parent.uuiidd;
        item.projectTitle = parent.title;

        if (sotoon.value.indexOf('0:00') == 0) {

          moduleData.createNewWorkHour.kwndSaveWHs_OnInit_ForEdit(dayTime, projectId, taskId, null);
          return;
        } else {

          $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetWorkHoursByDate",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ date: sotoon.date, taskId: taskId }),
            success: function (response) {

              if (response && response.length == 1 && response[0].workFlowStageType=='Resource') {
                moduleData.createNewWorkHour.kwndSaveWHs_OnInit_ForEdit(dayTime, 
                  projectId, taskId, moduleData.common_timeSheet.convertMinutsToTime(response[0].minutes), response[0].id);

              } else {

                for (var k in response) {
                  const item = response[k];
                  item.time = moduleData.common_timeSheet.convertMinutsToTime(item.minutes);
                }
                moduleData.history_sentWorkHour.ShowDataOnGrid(response, 'کارکردهای '+ dataItem.title + ' در ' + sotoon.persianDate);
                
              }
            },
            error: function (e) {
              var a = e;
            }
          });

        }
        return;
      }

      if (dataItem.type == 'Project') {

        $.ajax({
          type: "Post",
          url: "/api/TimeSheetsAPI/GetWorkHoursByDate",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          data: JSON.stringify({ date: sotoon.date, projectId: dataItem.uuiidd }),
          success: function (response) {

            for (var k in response) {
              const item = response[k];
              item.time = moduleData.common_timeSheet.convertMinutsToTime(item.minutes);
            }
            
            moduleData.history_sentWorkHour.ShowDataOnGrid(response, 'کارکردهای ' + dataItem.title + ' در ' + sotoon.persianDate);

          },
          error: function (e) {
            var a = e;
          }
        });

        return;
      }

      if (dataItem.type == 'Karkard') {
        moduleData.history_sentWorkHour.ShowCurrentDaySendWorkHours(dayTime, 'کارکردها در ' + sotoon.persianDate);
        return;
      }

      //alert("Satr: " + dataItem.title + " - Sotoon: " + dataItem.values[cellIndex - 3].title + " - type: "+dataItem.type);
    });



  }

  function ktrlTimeSheets_OnInitColumns(response) {

    var x = JSON.stringify(response);
    var columns = [];
    var colId = new KTRColumn();
    colId.field = "id";
    colId.title = "شناسه";
    colId.hidden = true;
    colId.width = 10;
    columns.push(colId);

    var colParentId = new KTRColumn();
    colParentId.field = "parentId";
    colParentId.title = "شناسه پدر";
    colParentId.hidden = true;
    colParentId.width = 10;
    columns.push(colParentId);

    var colTitle = new KTRColumn();

    colTitle.field = "title";
    colTitle.title = "عنوان";
    colTitle.hidden = false,

      colTitle.width = 240;
    columns.push(colTitle);

    for (var i = 0; i < response[0].values.length; i++) {

      var tsDate = response[0].values[i];
      var colDate = new KTRColumn();
      colDate.field = "values[" + i + "].value";
      //colDate.template = "#= type=='Defference' ? '<span title=\"تایید شده\">1:00</span> | <span title=\"برگشت شده\">2:00</span>' :  (values[ " + i + " ].value) #";
      colDate.format = "";
      colDate.title = tsDate.title;
      colDate.headerTemplate = "<h6 style='text-align:center'><b>" + tsDate.persianDate + "</b></h6><h6 style='text-align:center'>" + tsDate.persianDay + "</h6>";

      var inner = tsDate.value;

      colDate.headerTemplate += "<div style='text-align:center'>";

      if (!inner.isOpen && !inner.has_NotSendData && !inner.hasKarkard) {
        colDate.headerTemplate += "<label title=' ' class='text-warning' ><i class='glyphicon glyphicon-ban-circle'></i> </label>"
      }

      if (inner.isOpen) {

        colDate.headerTemplate += `<button title='ثبت ساعت کارکرد' 
                          class='btn btn-success btn-xs forFound_kwndSaveWHs_OnInit' style='width:10px;height:15px'
                          data-day-index='${i}'>+</button>`;
      }
      if (inner.hasKarkard) {

        colDate.headerTemplate += `<button title='نمایش کارکردهای این روز'   
              class='btn btn-info btn-xs forFound_ShowCurrentDaySendWorkHours' style='width:10px;height:15px;margin-right:5px;' 
              data-day-index='${i}'><i class="glyphicon glyphicon-exclamation-sign"></i></button>`;
      }

      if (inner.has_NotSendData) {

        colDate.headerTemplate += `<button title='ارسال ساعت کارکرد'
              class='btn btn-warning btn-xs forFound_wndSendWorkHour_OnInit' style='width:10px;height:15px;margin-right:5px;'
              data-day-index='${i}'><b>↑</b></button>`;

      }
      colDate.headerTemplate += "</div>";

      colDate.hidden = false;
      colDate.width = 100;
      columns.push(colDate);
    }

    return columns;
  }

  function ktrlTimeSheets_DataBound(e) {

    var treeList = $("#ktrlTimeSheets").data("kendoTreeList");
    moduleData.common_timeSheet.expandTreeListItems(treeList, moduleData.expandedRows);


    $('.forFound_kwndSaveWHs_OnInit').off().on('click', function () {
      var id = $(this).data("dayIndex");
      moduleData.createNewWorkHour.kwndSaveWHs_OnInit(id);
    });

    $('.forFound_ShowCurrentDaySendWorkHours').off().on('click', function () {
      var sendId = $(this).data("dayIndex");
      var timeSheetData = moduleData.data.timeSheetData_get();
      var dayTime = timeSheetData[0].values[sendId];
      moduleData.history_sentWorkHour.ShowCurrentDaySendWorkHours(dayTime, 'نمایش کارکردها');
    });

    $('.forFound_wndSendWorkHour_OnInit').off().on('click', function () {
      var semlId = $(this).data("dayIndex");
      moduleData.sendWorkHour.wndSendWorkHour_OnInit(semlId);
    });
  }






  return {
    GetTimeSheets: GetTimeSheets,
    Init_TimeSheetTreeList: Init_TimeSheetTreeList,
    RefreshTimeSheet: RefreshTimeSheet,
    init: init,
    ResetAllThings: ResetAllThings
  };

})();




//________________

module.exports = {

  'GetTimeSheets': myMainGrid.GetTimeSheets,
  'Init_TimeSheetTreeList': myMainGrid.Init_TimeSheetTreeList,
  'RefreshTimeSheet': myMainGrid.RefreshTimeSheet,
  'init': myMainGrid.init,
  ResetAllThings: myMainGrid.ResetAllThings

};
},{}]},{},[3]);
