(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const common = (function () {

	function version(){return "0.0.0.2";}

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
	function window_height(){
		return ($( window ).height() - 50) + "px";
	}
	function addNoScrollToBody(){
		$("body").addClass("ob-no-scroll");
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
	addNoScrollToBody: common.addNoScrollToBody,
	removeNoScrollToBody: common.removeNoScrollToBody,

	version:common.version
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



    function convertServerDataToTimeSheet_ForEmployee(response) {
        const data = [];

        const amaliat = new timeSheet_Row(0, null, "عملیات", "-", "eb96abcb-d37d-4aa1-1000-e1f4a753bee5", []);
        data.push(amaliat);

        const hozoor = new timeSheet_Row(1, null, "حضور", "-", "eb96abcb-d37d-4aa1-1001-e1f4a753bee5", []);
        data.push(hozoor);

        const karkard = new timeSheet_Row(2, null, "کارکرد", "-", "eb96abcb-d37d-4aa1-1002-e1f4a753bee5", []);
        data.push(karkard);

        const projects = [];
        const times = private_findTimesAndProjects(response, hozoor, karkard, projects, null);

        private_addDailyTimes(data, times, projects, 2);

        const notSendId = data.length + 1
        const karkard_notSend = new timeSheet_Row(notSendId, null, "ارسال نشده", "-", "eb96abcb-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_notSend);



        const projects_notSendByEmployee = [];
        const times_notSend = private_findTimesAndProjects(response, null, karkard_notSend, projects_notSendByEmployee, "Resource");

        private_addDailyTimes(data, times_notSend, projects_notSendByEmployee, notSendId, true);


        const projects_approving = [];
        const times_approve = private_findTimesAndProjects(response, null, null, projects_approving, "Approving");

        const projects_final = [];
        const times_final = private_findTimesAndProjects(response, null, null, projects_final, "Final");

        private_addTimesForAmaliat(hozoor, karkard_notSend, karkard, amaliat);

        return data;
    }

    function private_addTimesForAmaliat(hozoor, noSend, mainKarkard, amalit) {

        const times = [];

        for (let i = 0; i < hozoor.values.length; i++) {
            const hozoorTodayTime = hozoor.values[i];
            const nosendTodayTime = noSend.values[i];
            const mainKarkardTodayTime = noSend.values[i];
debugger;
            amalit.values.push({
                date: hozoorTodayTime.date,
                persianDate: hozoorTodayTime.persianDate,
                persianDay: hozoorTodayTime.persianDay,
                title: hozoorTodayTime.persianDate,
                value: {isOpen: hozoorTodayTime.isOpen, has_NotSendData: !!nosendTodayTime.minute, hasKarkard: !!mainKarkardTodayTime.minute} 
            });

        }
    }

    function convertServerDataToTimeSheet_ForApprove(response) {
        const data = [];

        const hozoor = new timeSheet_Row(1, null, "حضور", "-", "eb96abcb-d37d-4aa1-1001-e1f4a753bee5", []);
        data.push(hozoor);

        const karkard = new timeSheet_Row(2, null, "کارکرد", "-", "eb96abcb-d37d-4aa1-1002-e1f4a753bee5", []);
        data.push(karkard);

        const projects = [];
        const times = private_findTimesAndProjects(response, hozoor, karkard, projects, null);

        private_addDailyTimes(data, times, projects, 2);

        const taeedNashodeId = data.length + 1
        const karkard_notApprove = new timeSheet_Row(taeedNashodeId, null, "تایید نشده", "-", "eb96abcb-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_notApprove);

        const projects_notApprove = [];
        const times_notApprove = private_findTimesAndProjects(response, null, karkard_notApprove, projects_notApprove, "TaskNotApprove");

        private_addDailyTimes(data, times_notApprove, projects_notApprove, taeedNashodeId, true);

        return data;
    }

    function private_addDailyTimes(data, times, projects, parentId, isApprove) {

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
                let isNewSavedProject = false;
                if (pIndex == -1) {
                    savedProject = { id: cProject.id, title: cProject.title, workouts: [] };
                    isNewSavedProject = true;
                } else {
                    savedProject = projects[pIndex];
                }

                for (let k = 0; k < dbProject.workouts.length; k++) {
                    const dbWorkout = dbProject.workouts[k];
                    const cWorkout = new timeSheet_Workout(dbWorkout.id, dbWorkout.title, dbWorkout.hours, dbWorkout.state);

                    if (!wantedState || cWorkout.state == wantedState) {
                        cProject.workouts.push(cWorkout);
                        if (savedProject.workouts.findIndex(p => p.id == cWorkout.id) == -1) savedProject.workouts.push({
                            id: cWorkout.id, title: cWorkout.title, state: cWorkout.state, hours: cWorkout.hours
                        });
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
                value: convertNumberToTime(dbTime.hozoor),
                minute: dbTime.hozoor,
                isOpen: dbTime.isOpen
            });
            if (karkard) karkard.values.push({
                date: cTime.date,
                persianDate: cTime.persianDate,
                persianDay: cTime.persianDay,
                title: cTime.persianDate,
                value: convertNumberToTime(cTime.calcTime()),
                minute: cTime.calcTime()
            });
        }

        return times;
    }


    return {
        convertServerDataToTimeSheet_ForEmployee: convertServerDataToTimeSheet_ForEmployee,
        convertServerDataToTimeSheet_ForApprove: convertServerDataToTimeSheet_ForApprove,
        convertNumberToTime: convertNumberToTime
    }

})();

module.exports = {
    convertServerDataToTimeSheet_ForEmployee: timeSheet.convertServerDataToTimeSheet_ForEmployee,
    convertServerDataToTimeSheet_ForApprove: timeSheet.convertServerDataToTimeSheet_ForApprove,
    convertNumberToTime: timeSheet.convertNumberToTime
};
},{}],3:[function(require,module,exports){
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
    $("#PresenceYesterday").text(response.presence);
    $("#WorkYesterday").text(response.work);
    $("#differenceYesterday").text(response.defference);
    $("#PresenceYesterdaypercent").width(response.presencepercent * 10);
    $("#workYesterdaypercent").width(response.workpercent * 10);
    $("#differentYesterdaypercent").width(response.defferencepercent * 10);

}

function Page_OnInitThisMonth(response) {
    _ThisMonthData = response

    $("#PresenceThisMonth").text(response.presence);
    $("#WorkThisMonth").text(response.work);
    $("#differenceThisMonth").text(response.defference);
    $("#PresenceThisMonthpercent").width(response.presencepercent);
    $("#workThisMonthpercent").width(response.workpercent);
    $("#differentThisMonthpercent").width(response.defferencepercent);


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

    $("#hoursWaitingToApprove").text(commonTimesheet.convertNumberToTime(response.hours));
    $("#hoursWaitingToApprovePercent").width(response.hours);

}

},{"../common/common":1,"../common/timesheet":2}]},{},[3]);
