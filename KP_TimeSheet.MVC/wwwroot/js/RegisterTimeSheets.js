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

	function openWindow(id,fnActivated,fnClose){
		$(`#${id}`).kendoWindow({
			activate: ()=>{
				 addNoScrollToBody();
				 if(fnActivated) fnActivated();
			},
			deactivate: removeNoScrollToBody,
	  
			scrollable: true,
			visible: false,
			modal: true,
			actions: [
			  "Pin",
			  "Minimize",
			  "Maximize",
			  "Close"
			],
			close: ()=>{ if(fnClose) fnClose()}
		  }).data("kendoWindow")
		  .setOptions({width: window_width(), height: window_height()});
		  $(`#${id}`).data("kendoWindow").center().open();
	}

	return {
		loaderShow: loaderShow,
		loaderHide: loaderHide,
		Notify: notify,
		DoExport: doExport,
		adjustSize: adjustSize,

		window_height: window_height,
		window_width: window_width,
		openWindow: openWindow,

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
	openWindow: common.openWindow,

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
        const notSendId = data.length;
        const karkard_notSend = new timeSheet_Row(notSendId, null, "ارسال نشده", "DontSend", "66666666-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_notSend);


        const projects_notSendByEmployee = [];
        const times_notSend = private_findTimesAndProjects('work', response, null, null, karkard_notSend, null, projects_notSendByEmployee, "Resource");

        if (projects_notSendByEmployee.length) {
            private_addProjectsAndTasksTimes(data, times_notSend, projects_notSendByEmployee, notSendId, true);
        } else data.pop();


        private_addTimesForAmaliat(hozoor, karkard_notSend, karkard, amaliat);


        // // // //--------------------------------------------------------------------------------
        // // // const onApprovingId = data.length;
        // // // const karkard_onApproving = new timeSheet_Row(onApprovingId, null, "در حال تایید", "OnApproving", "77777777-d37d-1001-0000-e1f4a753bee5", []);
        // // // data.push(karkard_onApproving);

        // // // const projects_approving = [];
        // // // const times_approve = private_findTimesAndProjects('work', response, null, null, karkard_onApproving, null, projects_approving, "Approving");

        // // // if(projects_approving.length){
        // // //     private_addProjectsAndTasksTimes(data, times_approve, projects_approving, onApprovingId, true);
        // // // }else data.pop();
        // // // //--------------------------------------------------------------------------------

        // // // const finalId = data.length;
        // // // const karkard_final = new timeSheet_Row(finalId, null, "تایید نهایی", "Final", "88888888-d37d-1001-0000-e1f4a753bee5", []);
        // // // data.push(karkard_final);

        // // // const projects_final = [];
        // // // const times_final = private_findTimesAndProjects('work', response, null, null, karkard_final, null, projects_final, "Final");

        // // // if(projects_final.length){
        // // //     private_addProjectsAndTasksTimes(data, times_final, projects_final, finalId, true);
        // // // }else data.pop();

        //---------------------------------------------------------------------------------

        const deniedId = data.length;
        const karkard_deny = new timeSheet_Row(deniedId, null, "رد شده", "Denied", "99999999-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_deny);

        const projects_deny = [];
        const times_deny = private_findTimesAndProjects('work', response, null, null, karkard_deny, null, projects_deny, "Denied");

        if (projects_deny.length) {
            private_addProjectsAndTasksTimes(data, times_deny, projects_deny, deniedId, true);
        } else data.pop();

        //---------------------------------------------------------------------------------


        const otherId = data.length;
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

        const amaliat = new timeSheet_Row(0, null, "عملیات", "Amaliat", "eb96abcb-d37d-0000-1000-e1f4a753bee5", []);
        data.push(amaliat);

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
        const taeedNashodeId = data.length;
        const karkard_notApprove = new timeSheet_Row(taeedNashodeId, null, "تایید نشده", "-", "eb96abcb-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_notApprove);

        const projects_notApprove = [];
        const times_notApprove = private_findTimesAndProjects('work', response, null, null, karkard_notApprove, null, projects_notApprove, "TaskNotApprove");

        private_addProjectsAndTasksTimes(data, times_notApprove, projects_notApprove, taeedNashodeId, true);
        if(projects_notApprove.length){
            for(let i=taeedNashodeId;i<data.length;i++){
                data[i].has_NotApproveData = true;
            }
        }

        private_addTimesForAmaliat_approver(hozoorDetail, karkard_notApprove, amaliat);

        //----------------------------------------------------------------------------
        const otherId = data.length;
        const karkard_other = new timeSheet_Row(otherId, null, "سایر", "-", "eb96abcb-d37d-1005-0000-e1f4a753bee5", []);
        data.push(karkard_other);

        const projects_ohter = [];
        const times_other = private_findTimesAndProjects('ohter', response, null, null, karkard_other, null, projects_ohter, null);
        if (projects_ohter.length) {

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

    function private_addTimesForAmaliat_approver(hozoor, notApprove, amalit) {
        //یک دکمه بالا صفحه را مشخص می کنه که باشه یا نه

        for (let i = 0; i < hozoor.values.length; i++) {
            const hozoorTodayTime = hozoor.values[i];
            const notApproveTodayTime = notApprove.values[i];

            amalit.values.push({
                date: hozoorTodayTime.date,
                persianDate: hozoorTodayTime.persianDate,
                persianDay: hozoorTodayTime.persianDay,
                title: hozoorTodayTime.persianDate,
                has_NotApproveData: !!notApproveTodayTime.minute
            });

        }
    }

    function private_addProjectsAndTasksTimes(data, times, projects, parentId, isApprove) {

        if (projects.length == 0) return;

        const rowProjects = [];
        for (var i = 0; i < projects.length; i++) {
            const proj = projects[i];
            const pId = data.length;
            var p = new timeSheet_Row(pId, parentId, proj.title, "Project", proj.id, []);
            data.push(p);
            rowProjects.push(p);

            p.workouts = [];

            for (var j = 0; j < proj.workouts.length; j++) {
                const workout = proj.workouts[j];
                var w = new timeSheet_Row(data.length, pId, workout.title, isApprove ? workout.state : "Workout", workout.id, []);
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
},{"../registerTimeSheet/mainGrid":15}],3:[function(require,module,exports){
const service = (function () {

	const moduleData = {};

	function init(data, common_timeSheet, common) {
		moduleData.data = data;
		moduleData.common_timeSheet = common_timeSheet;
		moduleData.common= common;
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
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
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
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
		});

	}

	function getTimeSheetsByUserIdForFirstTime(success_callBack, error_callBack) {

		$.ajax({
			type: "Get",
			url: "/api/timesheetsNew/" +moduleData.common.version()+"/" + moduleData.data.userId_get(),
			contentType: "application/json; charset=utf-8",
			dataType: "json",

			success: function (response) {

				var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForApprove(response);

				moduleData.data.timeSheetDataConfirm_set(data);

				if (success_callBack) success_callBack(data);
			},
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
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
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
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
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
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
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
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
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
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
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
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
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
		});
	}

	function changeDisplayPeriodToWeeklyConfirm(success_callBack, error_callBack) {
		$.ajax({
			type: "Get",
			url: "/api/timesheetsNew/ChangeDisplayPeriodToWeeklyConfirm",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: () => {
				if (success_callBack) success_callBack();
			},
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
		});
	}

	function changeDisplayPeriodToDaily(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/timesheetsNew/ChangeDisplayPeriodToDaily",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: () => {
				if (success_callBack) success_callBack();
			},
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
		});
	}


	function getPreviousNextPeriodConfirm(userId, startDate = null, toDate = null, success_callBack, error_callBack) {
		var type = "previous";
		let date = startDate;
		if (startDate == null) {
			type = "next";
			date = toDate;
		}
		$.ajax({
			type: "Get",
			url: `/api/timesheetsNew/${moduleData.common.version()}/${type}/${userId}/${date}`,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (response) => {

				var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForApprove(response);

				moduleData.data.timeSheetDataConfirm_set(data);
				if (success_callBack) success_callBack(data);
			},
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
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
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
		});
	}



	function getWaitingApproveWorkHourDetail(data, success_callBack, error_callBack) {

		let url = `/api/timesheetsNew/waitingApprove/${data.wantedUserId}/${data.startDate}/${data.endDate}`;
		if (data.projectId) url += `/${data.projectId}`;
		if (data.taskId) url += `/${data.taskId}`;

		$.ajax({
			type: "Get",
			url: url,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: () => {
				if (success_callBack) success_callBack();
			},
			error: (error) => {
				moduleData.common.loaderHide();
                moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
                if (error_callBack) error_callBack();
            }
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
		changeDisplayPeriodToDaily: changeDisplayPeriodToDaily,
		getPreviousNextPeriodConfirm: getPreviousNextPeriodConfirm,
		getCurrentPeriodConfirm: getCurrentPeriodConfirm,
		getWaitingApproveWorkHourDetail: getWaitingApproveWorkHourDetail
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
	changeDisplayPeriodToDaily: service.changeDisplayPeriodToDaily,
	getPreviousNextPeriodConfirm: service.getPreviousNextPeriodConfirm,
	getCurrentPeriodConfirm: service.getCurrentPeriodConfirm,
	getWaitingApproveWorkHourDetail: service.getWaitingApproveWorkHourDetail
}
},{}],4:[function(require,module,exports){
const common = require('../common/common');
const common_register = require('./common');
const data = require('./data');
const createNewWorkHour = require('./createNewWorkHour');
const mainGrid = require('./mainGrid');
const bottomPage_priodlyGrid = require('./bottomPage_priodlyGrid');
const bottomPage_monthlyGrid = require('./bottomPage_monthlyGrid');


const period_next_pervious = require('./period_next_pervious');
const history_sentWorkHour = require('./history_sentWorkHour');
const editWindow = require('./editWorkHour');
const history_workHour = require('./hisotory_workHour');
const sendWorkHour = require('./sendWorkHour');

const common_timeSheet = require('../common/timesheet');

const service = require('./service');
const serviceConfirm = require('../confirmTimeSheet/service');

const hourlyMission = require('./mission_hourly');
const hourlyLeave = require('./leave_hourly');
const dailyLeave = require('./leave_daily');




// Document Ready__________

$(document).ready(function () {

    common.loaderShow();

    data.init();
    bottomPage_monthlyGrid.init(data, common_timeSheet);
    bottomPage_priodlyGrid.init(data, common_timeSheet);
    service.init(data, common_timeSheet, common);

    $('#registerTiemSheet_exportToExcel').off().on('click', function () {
        common.doExport('#ktrlTimeSheets', { type: 'excel' });
    });
    $('#registerTiemSheet_exportToDoc').off().on('click', function () {
        common.doExport('#ktrlTimeSheets', { type: 'doc' });
    });

    editWindow.init(mainGrid, common, common_register, data, common_timeSheet, service);
    history_sentWorkHour.init(common, common_register, history_workHour, data, common_timeSheet, createNewWorkHour);

    mainGrid.init(common, common_register, common_timeSheet, createNewWorkHour, history_sentWorkHour, sendWorkHour, data,
        service, editWindow, history_sentWorkHour, bottomPage_priodlyGrid, bottomPage_monthlyGrid);

    mainGrid.GetTimeSheets(function () {
        bottomPage_priodlyGrid.InitPeriodlyByProjectsGrid();
        bottomPage_monthlyGrid.InitMonthlyByProjectsGrid();
        common.loaderHide();

        period_next_pervious.init(common, common_register, mainGrid,
            bottomPage_monthlyGrid, history_sentWorkHour, bottomPage_priodlyGrid, editWindow, data, service, serviceConfirm);

        createNewWorkHour.init(common, common_register, period_next_pervious, data, service, common_timeSheet);
        sendWorkHour.init(mainGrid, common, common_register, data, common_timeSheet);

        history_workHour.init(common, data);

        hourlyMission.init(common, data, service, period_next_pervious);
        hourlyLeave.init(common, data, service, period_next_pervious);
        dailyLeave.init(common, data, service, period_next_pervious);

    });
});




function exportTableToExcel(tableID, filename) {
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

    // Specify file name
    filename = filename ? filename + '.xls' : 'excel_data.xls';

    // Create download link element
    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
    }
}






},{"../common/common":1,"../common/timesheet":2,"../confirmTimeSheet/service":3,"./bottomPage_monthlyGrid":5,"./bottomPage_priodlyGrid":6,"./common":7,"./createNewWorkHour":8,"./data":9,"./editWorkHour":10,"./hisotory_workHour":11,"./history_sentWorkHour":12,"./leave_daily":13,"./leave_hourly":14,"./mainGrid":15,"./mission_hourly":16,"./period_next_pervious":17,"./sendWorkHour":18,"./service":19}],5:[function(require,module,exports){
//const data = require('./data');

//___________جدول پایین صفحه ماهانه

const monthlyGrid =(function(){

    const moduleData={};

    function init(data, common_timeSheet){
        moduleData.data = data;
        moduleData.common_timeSheet = common_timeSheet;

    }

    function InitMonthlyByProjectsGrid() {
        var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values[0]);
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetThisMonthData",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: function (response) {
                const items = [response.presencepercent, response.workpercent, response.defferencepercent];
                const v1= moduleData.common_timeSheet.calcPercent(items, response.presencepercent);
                const v2 = moduleData.common_timeSheet.calcPercent(items, response.workpercent);
                const v3 = moduleData.common_timeSheet.calcPercent(items, response.defferencepercent);

                moduleData.data.thisMonthdata_set(response);
                $("#MonthlyPresence").text(moduleData.common_timeSheet.convertMinutsToTime(response.presence));
                $("#MonthlyWorkHour").text(moduleData.common_timeSheet.convertMinutsToTime(response.work));
                $("#MonthlyDefference").text(moduleData.common_timeSheet.convertMinutsToTime(response.defference));
                $("#MonthlyPresencePercent").css('width', v1+'%').attr('aria-valuenow', v1);
                $("#MonthlyWorkHourPercent").css('width', v2+'%').attr('aria-valuenow', v2);
                $("#MonthlyDefferencePercent").css('width', v3+'%').attr('aria-valuenow', v3);
            },
            error: function (e) {
    
            }
        });
    
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetThisMonthProjects",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: KGRDMonthly_OnInit,
            error: function (e) {
    
            }
        });
    }
    
    function KGRDMonthly_OnInit(response) {
    
        $("#tblcurrmonth").kendoGrid({
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
    
    }

    return {
        InitMonthlyByProjectsGrid: InitMonthlyByProjectsGrid,
        init: init
    };
})();







module.exports ={
    'InitMonthlyByProjectsGrid': monthlyGrid.InitMonthlyByProjectsGrid,
    init: monthlyGrid.init
    
}
},{}],6:[function(require,module,exports){
//const data = require('./data');
//___________________دوره جاری جدول پایین صفحه 

const priodGrid = (function () {

    const moduleData={};

    function init(data,common_timeSheet) {
        moduleData.data = data;
        moduleData.common_timeSheet = common_timeSheet;
    }

    function InitPeriodlyByProjectsGrid() {

        var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values);
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetThisPeriodData",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: function (response) {
                _thisPerioddata = response;

                const items = [response.presencepercent, response.workpercent, response.defferencepercent];
                const v1= moduleData.common_timeSheet.calcPercent(items, response.presencepercent);
                const v2 = moduleData.common_timeSheet.calcPercent(items, response.workpercent);
                const v3 = moduleData.common_timeSheet.calcPercent(items, response.defferencepercent);

                $("#LblperHourCurrPeriod").text(moduleData.common_timeSheet.convertMinutsToTime(response.presence));
                $("#LblworkHourCurrPeriod").text(moduleData.common_timeSheet.convertMinutsToTime(response.work));
                $("#LblPeriodicallyDefference").text(moduleData.common_timeSheet.convertMinutsToTime(response.defference));
                $("#PRBperHourCurrPeriod").css('width', v1+'%').attr('aria-valuenow', v1);
                $("#PRBworkHourCurrPeriod").css('width', v2+'%').attr('aria-valuenow', v2);
                $("#PRGPeriodicallyDefferencePercent").css('width', v3+'%').attr('aria-valuenow', v3);
            },
            error: function (e) {

            }
        });



        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetThisPeriodProjects",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: KGRDPeriodically_OnInit,
            error: function (e) {

            }
        });
    }

    function KGRDPeriodically_OnInit(response) {

        $("#tblcurrperiod").kendoGrid({
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
        })

    }

    return {
        init:init,
        InitPeriodlyByProjectsGrid: InitPeriodlyByProjectsGrid
    };

})();



module.exports = {
    'InitPeriodlyByProjectsGrid': priodGrid.InitPeriodlyByProjectsGrid,
    init:priodGrid.init
};
},{}],7:[function(require,module,exports){


function removeAndRecreateTreelisDiv() {
    $("#ktrlTimeSheets").data("kendoTreeList").destroy();
    $("#ktrlTimeSheets").remove();
    $("#KTLContainer").append("<div id='ktrlTimeSheets'></div>");
}

module.exports={
    'removeAndRecreateTreelisDiv':removeAndRecreateTreelisDiv
}
},{}],8:[function(require,module,exports){
// const common = require('../common/common');
// const common_register = require('./common');
// const data = require('./data');
// const period_next_pervious = require('./period_next_pervious');
// const mainGrid = require('./mainGrid');


//_____________________پنجره ذخیره
const module_createNewRorkHour = (function () {

    const moduleData = {};

    function init(common, common_register, period_next_pervious, data, service, common_timeSheet) {
        moduleData.common = common;
        moduleData.common_register = common_register;
        moduleData.period_next_pervious = period_next_pervious;
        moduleData.data = data;
        moduleData.service = service;
        moduleData.common_timeSheet = common_timeSheet;

        moduleData.afterGetTasksEnd = null;

        moduleData.currentWorkoutId = null;

        $('#btnDeleteCurrentWorkhour').hide();

        $('#btnCancel_kwndSaveWHs').off().on('click', function () {
            kwndSaveWHs_OnClose();
        });
        $('#btnSaveWorkHours_kwndSaveWHs').off().on('click', function () {
            btnSaveWorkHours_Onclick();
        });

        $('#btnDeleteCurrentWorkhour').off().on('click', function () {
            if (!moduleData.currentWorkoutId) return;

            moduleData.common.loaderShow();

            moduleData.service.deleteWorkHour(moduleData.currentWorkoutId, () => {

                moduleData.period_next_pervious.GetCurrentPeriod();
                kwndSaveWHs_OnClose();
                moduleData.common.loaderHide();
            });
        });

    }

    function kwndSaveWHs_OnInit_ForEdit(dayTime, projectId, taskId_nullable, time_nullable, workoutId) {

        $('#btnDeleteCurrentWorkhour').hide();
        if (workoutId) $('#btnDeleteCurrentWorkhour').show();

        moduleData.currentWorkoutId = workoutId;
        moduleData.afterGetTasksEnd = null;
        var timeSheetData = moduleData.data.timeSheetData_get();
        

        $('#registerWindo_headerDiv').text(dayTime.persianDay + " " + dayTime.persianDate);

        moduleData.data.selDate_set(dayTime);

        moduleData.whenGetProjectsTasksEnd = () => {

        }

        if (taskId_nullable) {
            moduleData.afterGetProjectsEnd = () => {
                var dropdownlist = $("#ddlTasks").data("kendoDropDownList");
                dropdownlist.select(function (dataItem) {
                    return dataItem.id == taskId_nullable;
                });
            }
        }

        GetProjects(() => {
            var dropdownlist = $("#ddlProjects").data("kendoDropDownList");
            dropdownlist.select(function (dataItem) {
                return dataItem.id == projectId;
            });
            GetTasks();
        });

        if (time_nullable) $("#ktpWorkHour").val(time_nullable);
    }

    function kwndSaveWHs_OnInit(dayIndex) {
        $('#btnDeleteCurrentWorkhour').hide();
        moduleData.currentWorkoutId = null;
        moduleData.afterGetTasksEnd = null;

        var timeSheetData = moduleData.data.timeSheetData_get();
        var item = timeSheetData[0].values[dayIndex];

        $('#registerWindo_headerDiv').text(item.persianDay + " " + item.persianDate);

        moduleData.data.selDate_set(item);

        GetProjects();
    }

    function kwndSaveWHs_OnClose() {
        var w = $("#kwndSaveWorkHours").data("kendoWindow");
        ResetSaveWindow();
        if (w) w.close();
    }

    function GetProjects(afterGetProjectsEnd) {

        moduleData.service.getUserProjects((response)=>{
            ddlProjects_OnInit(response);
            if (afterGetProjectsEnd) afterGetProjectsEnd();
        });
        
    }

    function ddlProjects_OnInit(response) {

        if (response.length == 0) {
            moduleData.common.notify("کاربر گرامی شما فاقد پروژه میباشید", "danger");
            kwndSaveWHs_OnClose();
            return
        } else {

            $("#ddlProjects").kendoDropDownList({
                dataSource: {
                    data: response,
                    schema: {
                        model: {
                            id: "id"
                        }
                    }
                },
                dataTextField: "title",
                dataValueField: "id",
                filter: "contains",
                optionLabel: "انتخاب پروژه...",
                change: GetTasks
            });
            $("#ktpWorkHour").kendoTimePicker({
                format: "HH:mm"
            });

            moduleData.common.openWindow('kwndSaveWorkHours');
            
        }
    }

    function GetTasks() {

        var projID = $("#ddlProjects").data("kendoDropDownList").value();
        var prmData = { id: projID };
        $.ajax({
            type: "Get",
            url: "/api/ProjectsAPI/GetTasks",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: (response) => {

                ddlTasks_OnInit(response);
                if (moduleData.afterGetProjectsEnd) moduleData.afterGetProjectsEnd();

            },
            error: function (e) {

            }
        });
    }

    function ddlTasks_OnInit(response) {

        $("#ddlTasks").kendoDropDownList({
            dataSource: {
                data: response,
                schema: {
                    model: {
                        id: "id"
                    }
                }
            },
            dataTextField: "title",
            dataValueField: "id",
            filter: "contains",
            optionLabel: "انتخاب فعالیت...",
            //change: GetTasks
        });
        $("#TaskPanel").show(100);
        $("#TimeSpanPanel").show(100);

    }

    function btnSaveWorkHours_Onclick() {

        $("span[for='ktpWorkHour']").text(""); //جایی که خطاها را نشان می دهد را پاک میک می کند
        $("span[for='ddlTasks']").text("");

        var workHourJson = {
            ID: moduleData.currentWorkoutId,
            Date: moduleData.data.selDate_get().date,
            EmployeeID: null,
            TaskID: $("#ddlTasks").data("kendoDropDownList").value(),
            Minutes: moduleData.common_timeSheet.convertClockTextToMinute($("#ktpWorkHour").data("kendoTimePicker")._oldText),
            ProjectID: $("#ddlProjects").data("kendoDropDownList").value(),
            Description: $("#txtDescription").val()
        };

        if (!workHourJson.TaskID) {
            $("span[for='ddlTasks']").text("وظیفه ضروری است");
            return;
        }

        if (!workHourJson.Minutes) {
            $("#ktpWorkHour").val("");
            $("span[for='ktpWorkHour']").text("ساعت ضروری است");
            return;
        }


        moduleData.common.loaderShow();

        kwndSaveWHs_OnClose();
        var prmData = JSON.stringify(workHourJson);

        moduleData.service.saveWorkHours(prmData, SaveWorkHours_OnSuccess);
    }

    function SaveWorkHours_OnSuccess(response) {

        moduleData.period_next_pervious.GetCurrentPeriod();
        kwndSaveWHs_OnClose();
        if (response.lenth > 0) {
            for (var i = 0; i < response.length; i++) {
                moduleData.common.notify(response[i], "danger");
            }
        }
        else {
            moduleData.common.notify("ثبت کاکرد با موفقیت انجام شد", "success");
        }
    }

    function ResetSaveWindow() {
        var item = $("#ddlProjects").data("kendoDropDownList");
        if (item && item.select) item.select(0);

        item = $("#ddlTasks").data("kendoDropDownList");
        if (item && item.select) item.select(0);

        $("span[for='ktpWorkHour']").text("");
        $("span[for='ddlTasks']").text("");

        $("#ktpWorkHour").val("");

        $("#txtDescription").val("");
        $("#TaskPanel").hide();

        moduleData.afterGetProjectsEnd=null;
    }

    return {
        kwndSaveWHs_OnInit: kwndSaveWHs_OnInit,
        kwndSaveWHs_OnInit_ForEdit: kwndSaveWHs_OnInit_ForEdit,
        init: init
    };

})();




module.exports = {

    'kwndSaveWHs_OnInit': module_createNewRorkHour.kwndSaveWHs_OnInit,
    kwndSaveWHs_OnInit_ForEdit: module_createNewRorkHour.kwndSaveWHs_OnInit_ForEdit,
    'init': module_createNewRorkHour.init
}
},{}],9:[function(require,module,exports){
const dataM = (function () {

    const moduleData = {};

    function init() {
        moduleData._SelDate = {};
        moduleData.CurrentUser = {};
        moduleData._TimeSheetData = [];
        moduleData._TimeSheetData_BeforProcess = [];
        moduleData._WorkHourOnProjects = [];
        moduleData._thisMonthdata = {};
        moduleData._WorkHours = [];
        moduleData._DayIndex = {};
        moduleData._SendWorkHourGrid = [];
        moduleData._thisPerioddata = [];
        moduleData._MonitorSentWorkHours = [];
        moduleData._AllSentCount = 0;
        moduleData._AllReadyForSent = 0;
        moduleData._presenceHour = 0;
        moduleData._TodayHistorys = [];

        moduleData._UserProjects=[];
        moduleData._Users=[];
    };

    return {
        init: init,
        moduleData: moduleData
    }

})();


module.exports = {
    init: dataM.init,

    'selDate_get': function () { return dataM.moduleData._SelDate; },
    'selDate_set': function (data) { dataM.moduleData._SelDate = data; },

    'timeSheetData_get': function () { return dataM.moduleData._TimeSheetData; },
    'timeSheetData_set': function (data) { dataM.moduleData._TimeSheetData = data; },

    'timeSheetData_beforProcess_get': function () { return dataM.moduleData._TimeSheetData_BeforProcess; },
    'timeSheetData_beforProcess_set': function (data) { dataM.moduleData._TimeSheetData_BeforProcess = data; },

    'todayHistory_get': function () { return dataM.moduleData._TodayHistorys; },
    'todayHistory_set': function (data) { dataM.moduleData._TodayHistorys = data; },

    'thisMonthdata_get': function () { return dataM.moduleData._thisMonthdata; },
    'thisMonthdata_set': function (data) { dataM.moduleData._thisMonthdata = data; },

    'workHours_get': function () { return dataM.moduleData._WorkHours; },
    'workHours_set': function (data) { dataM.moduleData._WorkHours = data; },

    'dayIndex_get': function () { return dataM.moduleData._DayIndex; },
    'dayIndex_set': function (data) { dataM.moduleData._DayIndex = data; },


    'userProjects_get': function () { return dataM.moduleData._UserProjects; },
    'userProjects_set': function (data) { dataM.moduleData._UserProjects = data; },

    'users_get': function () { return dataM.moduleData._Users; },
    'users_set': function (data) { dataM.moduleData._Users = data; },

    
}
},{}],10:[function(require,module,exports){
// const data = require('./data');
// const common_register = require('./common');

//اون دکمه بالا سمت راست  ویرایش دوره جاری
//____________ویرایش
const editWorkHour = (function () {

	const moduleData = {};

	function init(mainGrid, common, common_register, data, common_timeSheet, service) {
		moduleData.mainGrid = mainGrid;
		moduleData.common = common;
		moduleData.common_register = common_register;
		moduleData.data = data;
		moduleData.common_timeSheet = common_timeSheet;
		moduleData.service = service;

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

		moduleData.service.deleteWorkHour(dataItem.id,()=>{
			Refresh_GrdEditWorkHour();

				moduleData.mainGrid.RefreshTimeSheet();
				moduleData.common.loaderHide();
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
},{}],11:[function(require,module,exports){
//const data = require('./data');

//_________________________________________ناریخچه___________________________________
const historyWorkHour = (function () {

	const moduleData={};

	function init(common, data) {
		
		moduleData.data = data;
		moduleData.common = common;

		$('#btnWorkHoureHistory_hide').off().on('click', function () {
			HideHistory();
		});
	}

	function Init_GRDHistory(e) {

		moduleData.common.loaderShow();

		var grid = $("#GrdMonitorSentWorkHour").data("kendoGrid");
		var dataItem = grid.dataItem($(e).closest("tr"));
		var prmData = JSON.stringify(dataItem);
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetHistoryWorkHour",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: function (response) {
				moduleData.data.todayHistory_set(response);
				$("#WorkHourHistory").data("kendoGrid").dataSource.read();
				ShowHistory();
				moduleData.common.loaderHide();
			},
			error: function (e) {

			}
		});
	}

	function Create_GrdHistory() {

		$("#WorkHourHistory").kendoGrid({
			dataSource: {
				transport: {
					read: function (e) {
						e.success(moduleData.data.todayHistory_get())
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
				field: "time",
				title: "ساعت",
				width: 80
			},
			{
				field: "managerName",
				title: "نام مدیر",
				width: 200
			}, {
				field: "action",
				title: "عملیات",
				width: 120
			}, {
				field: "stageTitle",
				title: "مرحله",
				width: 120

			}, {
				field: "description",
				title: "توضیحات",
				width: 400

			}
			]

		});
	}

	function ShowHistory() {
		$("#PanelMonitorWorkHour").fadeOut(400);
		
		$("#PanelHistory").fadeIn(400);
		var gridElement = $("#WorkHourHistory");
		var dataArea = gridElement.find(".k-grid-content");
		gridElement.height("100%");
		dataArea.height("372px");
	}

	function HideHistory() {
		$("#PanelMonitorWorkHour").fadeIn(400);
		$("#PanelHistory").fadeOut(400);
	}

	return {
		Create_GrdHistory:Create_GrdHistory,
		HideHistory:HideHistory,
		init: init,
		Init_GRDHistory: Init_GRDHistory
	};
})();



module.exports = {
	'Create_GrdHistory': historyWorkHour.Create_GrdHistory,
	'HideHistory': historyWorkHour.HideHistory,
	'init':historyWorkHour.init,
	'Init_GRDHistory': historyWorkHour.Init_GRDHistory
}
},{}],12:[function(require,module,exports){
// const common = require('../common/common');
// const data = require('./data');
// const hisotory_workHour=require('./hisotory_workHour');
// const common_register = require('./common');

//______________________نمایش کارکرد های ارسال شده
const hisotrSentWorkHour = (function () {

	const moduleData = {};

	function init(common, common_register, hisotory_workHour, data, common_timeSheet, createNewWorkHour) {

		moduleData.data = data;
		moduleData.common = common;
		moduleData.common_register = common_register;
		moduleData.hisotory_workHour = hisotory_workHour;
		moduleData.common_timeSheet = common_timeSheet;
		moduleData.createNewWorkHour = createNewWorkHour;

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
					}
					return answer;
				},
				headerTemplate: "<label class='text-center'> نمایش تاریخچه </label>",
				filterable: false,
				sortable: false,
				width: 140
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

	function ShowDataOnGrid(data, headerTitle) {
		if(headerTitle) $('#headerText_MonitorSendWorkHours').text(headerTitle);

		_MonitorSentWorkHours = data;
		Init_GrdMonitorSentWorkHour();
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

	function ShowCurrentDaySendWorkHours(dayTime, headerTitle) {

		if(headerTitle) $('#headerText_MonitorSendWorkHours').text(headerTitle);

		moduleData.common.loaderShow();
		moduleData.hisotory_workHour.Create_GrdHistory();

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
				Init_GrdMonitorSentWorkHour();
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

},{}],13:[function(require,module,exports){
const dl = (function () {

	const moduleData = {};

	function init(common, data, service, period_next_pervious) {

		moduleData.common = common;
		moduleData.data = data;
		moduleData.service = service;
		moduleData.period_next_pervious = period_next_pervious;

		moduleData.leaveTypes = [
			{ id: 1, value: 'Deserved', title: 'استحقاقی' },
			{ id: 2, value: 'Cure', title: 'استعلاجی' },
			{ id: 3, value: 'WithOutSalary', title: 'بدون حقوق' },
			{ id: 4, value: 'OtherCases', title: 'سایر موارد' }
		];



		$('#btnNewDailyLeave').off().on('click', function () {
			private_openLeaveWindow();
		});

		$('#dailyLeave_btnCancel').off().on('click', function () {
			private_closeWindow();
		});

		$('#dailyLeave_btnSave').off().on('click', function () {
			save();
		});


		moduleData.service.getUserProjects();
		moduleData.service.getUsers();

	}

	function private_closeWindow() {
		var w = $("#kwndDailyLeave").data("kendoWindow");
		if (w) w.close();
		reset();
	}

	function private_openLeaveWindow() {

		$("#dailyLeave_headerDiv").text("ثبت مرخصی روزانه");

		moduleData.common.openWindow('kwndDailyLeave',function () {

			private_setDatepicker();
			private_leaveTypeComboInit();

			var projects = moduleData.data.userProjects_get();
			if (!projects || projects.length == 0) {
				moduleData.service.getUserProjects((response) => {
					private_projectComboInit(response);
				});
			} else {
				private_projectComboInit(projects);
			}

			var users = moduleData.data.users_get();
			if (!users || users.length == 0) {
				moduleData.service.getUsers((response) => {
					private_alternateComboInit(response);
				});
			} else {
				private_alternateComboInit(users);
			}

		}, reset);

	}

	function private_leaveTypeComboInit() {

		$("#dailyLeave_type").kendoDropDownList({
			dataSource: {
				data: moduleData.leaveTypes,
				schema: {
					model: {
						id: "id"
					}
				}
			},
			dataTextField: "title",
			dataValueField: "id",
			filter: "contains",
			optionLabel: "انتخاب نوع مرخصی ...",
			//change: GetTasks
		});

	}

	function private_projectComboInit(response) {

		$("#dailyLeave_selectProject").kendoDropDownList({
			dataSource: {
				data: response,
				schema: {
					model: {
						id: "id"
					}
				}
			},
			dataTextField: "title",
			dataValueField: "id",
			filter: "contains",
			optionLabel: "انتخاب پروژه ...",
			//change: GetTasks
		});

	}

	function private_alternateComboInit(response) {

		$("#dailyLeave_selectAlternate").kendoDropDownList({
			dataSource: {
				data: response,
				schema: {
					model: {
						id: "id"
					}
				}
			},
			dataTextField: "title",
			dataValueField: "id",
			filter: "contains",
			optionLabel: "انتخاب جانشین ...",
			//change: GetTasks
		});

	}

	function private_setDatepicker() {

		var timeSheetData = moduleData.data.timeSheetData_get();
		var startTime = timeSheetData[0].values[0];
		var endTime = timeSheetData[0].values[timeSheetData[0].values.length - 1];

		$('#dailyLeave_dateStart').daterangepicker({
			clearLabel: 'Clear',
			autoApply: true,
			opens: 'left',
			minDate: moment(startTime.date),
			maxDate: moment(endTime.date),
			singleDatePicker: true,
			showDropdowns: true,
			jalaali: true,
			language: 'fa'
		}).on('apply.daterangepicker', function () {
			$('.tooltip').hide();
			$('.date-select').text($(this).val());
		});

		$('#dailyLeave_dateFinish').daterangepicker({
			clearLabel: 'Clear',
			autoApply: true,
			opens: 'left',
			minDate: moment(startTime.date),
			singleDatePicker: true,
			showDropdowns: true,
			jalaali: true,
			language: 'fa'
		}).on('apply.daterangepicker', function () {
			$('.tooltip').hide();
			$('.date-select').text($(this).val());
		});


	}

	//Save-----------------------------------------------------------------
	function reset() {
		$('#dailyLeave_dateStart').val('');
		$('#dailyLeave_dateFinish').val('');

		var item = $("#dailyLeave_selectAlternate").data("kendoDropDownList");
		if (item && item.select) item.select(0);

		item = $("#dailyLeave_selectProject").data("kendoDropDownList");
		if (item && item.select) item.select(0);

		var item = $("#dailyLeave_type").data("kendoDropDownList");
		if (item && item.select) item.select(0);

		resetErrors();
	}
	function resetErrors() {
		//جایی که خطاها را نشان می دهد را پاک می کند
		$("span[for='dailyLeave_dateStart']").text("");
		$("span[for='dailyLeave_dateFinish']").text("");
		$("span[for='dailyLeave_type']").text("");
	}

	function save() {
		resetErrors();

		var dailyLeave = {
			id: "00000000-0000-0000-0000-000000000000",
			persianDateFrom: $('#dailyLeave_dateStart').val(),
			persianDateTo: $('#dailyLeave_dateFinish').val(),
			successorID: $("#dailyLeave_selectAlternate").data("kendoDropDownList").value(),
			projectID: $("#dailyLeave_selectProject").data("kendoDropDownList").value(),
			type: $("#dailyLeave_type").data("kendoDropDownList").value()
		};

		if (!dailyLeave.persianDateFrom.length) {
			$("span[for='dailyLeave_dateStart']").text("تاریخ شروع ضروری است");
			return;
		}
		if (!dailyLeave.persianDateTo.length) {
			$("span[for='dailyLeave_dateFinish']").text("تاریخ پایان ضروری است");
			return;
		}
		if (!dailyLeave.type.length) {
			$("span[for='dailyLeave_type']").text("نوع مرخصی ضروری است");
			return;
		}

		if (!dailyLeave.successorID.length) dailyLeave.successorID = "00000000-0000-0000-0000-000000000000";
		if (!dailyLeave.projectID.length) dailyLeave.projectID = "00000000-0000-0000-0000-000000000000";
		dailyLeave.type = parseInt(dailyLeave.type);

		moduleData.service.saveDailyLeave(dailyLeave, () => {

			moduleData.period_next_pervious.GetCurrentPeriod();
			private_closeWindow();
			moduleData.common.notify("ثبت مرخصی روزانه با موفقیت انجام شد", "success");

		});
	}



	return {
		init: init
	};

})();

module.exports = {
	init: dl.init
};
},{}],14:[function(require,module,exports){
const hl = (function () {

  const moduleData = {};

  function init(common, data, service, period_next_pervious) {

    moduleData.common = common;
    moduleData.data = data;
    moduleData.service = service;
    moduleData.period_next_pervious = period_next_pervious;

    $('#btnNewHourlyLeave').off().on('click', function () {
      private_openLeaveWindow();
    });

    $('#leave_btnCancel').off().on('click', function () {
      private_closeWindow();
    });

    $('#leave_btnSave').off().on('click', function () {
      save();
    });


  }

  function private_closeWindow(){
    var w = $("#kwndHourlyLeave").data("kendoWindow");
    if (w) w.close();
    reset();
  }

  function private_openLeaveWindow() {

    $("#leave_headerDiv").text("ثبت مرخصی ساعتی");

    moduleData.service.getUserProjects((response) => {
      private_projectComboInit(response);
    });

    moduleData.common.openWindow('kwndHourlyLeave',()=>private_setDatepicker(),reset);

  }

  function private_projectComboInit(response) {

    $("#leave_selectProject").kendoDropDownList({
      dataSource: {
        data: response,
        schema: {
          model: {
            id: "id"
          }
        }
      },
      dataTextField: "title",
      dataValueField: "id",
      filter: "contains",
      optionLabel: "انتخاب پروژه...",
      //change: GetTasks
    });

  }

  function private_setDatepicker() {

    var timeSheetData = moduleData.data.timeSheetData_get();
    var startTime = timeSheetData[0].values[0];
    var endTime = timeSheetData[0].values[timeSheetData[0].values.length - 1];

    $('#leave_date').daterangepicker({
      clearLabel: 'Clear',
      autoApply: true,
      opens: 'left',
      minDate: moment(startTime.date),
      maxDate: moment(endTime.date),
      singleDatePicker: true,
      showDropdowns: true,
      jalaali: true,
      language: 'fa'
    }).on('apply.daterangepicker', function () {
      $('.tooltip').hide();
      $('.date-select').text($(this).val());
    });

    $("#leave_hourStart").kendoTimePicker({
      format: "HH:mm"
    });
    $("#leave_hourFinish").kendoTimePicker({
      format: "HH:mm"
    });

  }


  //Save-----------------------------------------------------------------
  function reset() {

    $('#leave_date').val('');
    $('#leave_hourStart').val('');
    $('#leave_hourFinish').val('');


    var item = $("#leave_selectProject").data("kendoDropDownList");
    if (item && item.select) item.select(0);

    resetErrors();
  }
  function resetErrors() {
    //جایی که خطاها را نشان می دهد را پاک می کند
    $("span[for='leave_date']").text("");
    $("span[for='leave_hourStart']").text("");
    $("span[for='leave_hourFinish']").text("");
  }

  function save() {
    resetErrors();

    var mission = {
      id: "00000000-0000-0000-0000-000000000000",
      persianLeaveDate: $('#leave_date').val(),
      persianTimeFrom: $('#leave_hourStart').val(),
      persianTimeTo: $('#leave_hourFinish').val(),
      projectID: $("#leave_selectProject").data("kendoDropDownList").value(),
    };

    if (!mission.persianLeaveDate.length) {
      $("span[for='leave_date']").text("تاریخ ضروری است");
      return;
    }
    if (!mission.persianTimeFrom.length) {
      $("span[for='leave_hourStart']").text("ساعت شروع ضروری است");
      return;
    }
    if (!mission.persianTimeTo.length) {
      $("span[for='leave_hourFinish']").text("ساعت پایان ضروری است");
      return;
    }


    if (!mission.projectID.length) mission.projectID = "00000000-0000-0000-0000-000000000000";

    moduleData.service.saveHourlyLeave(mission, () => {

      moduleData.period_next_pervious.GetCurrentPeriod();
			private_closeWindow();
			moduleData.common.notify("ثبت مرخصی ساعتی با موفقیت انجام شد", "success");

    });
  }

  return {
    init: init
  };

})();

module.exports = {
  init: hl.init
};
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
const hm = (function () {

  const moduleData = {};

  function init(common, data, service, period_next_pervious) {

    moduleData.common = common;
    moduleData.data = data;
    moduleData.service = service;
    moduleData.period_next_pervious = period_next_pervious;

    $('#btnNewHourlyMission').off().on('click', function () {
      private_openMissionWindow();
    });

    $('#mission_btnCancel').off().on('click', function () {
      private_closeWindow();
    });
    $('#mission_btnSave').off().on('click', function () {
      save();
    });


  }

  function private_closeWindow(){
    var w = $("#kwndHourlyMission").data("kendoWindow");
      if (w) w.close();
      reset();
  }

  function private_openMissionWindow() {

    $("#mission_headerDiv").text("ثبت ماموریت ساعتی");

    moduleData.service.getUserProjects((response) => {
      private_projectComboInit(response);
    });

    moduleData.common.openWindow('kwndHourlyMission',()=>private_setDatepicker(),reset);

  }

  function private_projectComboInit(response) {

    $("#mission_selectProject").kendoDropDownList({
      dataSource: {
        data: response,
        schema: {
          model: {
            id: "id"
          }
        }
      },
      dataTextField: "title",
      dataValueField: "id",
      filter: "contains",
      optionLabel: "انتخاب پروژه...",
      //change: GetTasks
    });

  }

  function private_setDatepicker() {

    var timeSheetData = moduleData.data.timeSheetData_get();
    var startTime = timeSheetData[0].values[0];
    var endTime = timeSheetData[0].values[timeSheetData[0].values.length - 1];

    $('#mission_date').daterangepicker({
      clearLabel: 'Clear',
      autoApply: true,
      opens: 'left',
      minDate: moment(startTime.date),
      maxDate: moment(endTime.date),
      singleDatePicker: true,
      showDropdowns: true,
      jalaali: true,
      language: 'fa'
    }).on('apply.daterangepicker', function () {
      $('.tooltip').hide();
      $('.date-select').text($(this).val());
    });

    $("#mission_hourStart").kendoTimePicker({
      format: "HH:mm"
    });
    $("#mission_hourFinish").kendoTimePicker({
      format: "HH:mm"
    });

  }


  //Save-----------------------------------------------------------------
	function reset() {

		$('#mission_date').val('');
    $('#mission_hourStart').val('');
    $('#mission_hourFinish').val('');


		var item = $("#mission_selectProject").data("kendoDropDownList");
		if (item && item.select) item.select(0);

		resetErrors();
	}
	function resetErrors() {
		//جایی که خطاها را نشان می دهد را پاک می کند
		$("span[for='mission_date']").text("");
		$("span[for='mission_hourStart']").text("");
		$("span[for='mission_hourFinish']").text("");
  }
  
  function save() {
    resetErrors();


		var mission = {
			id: "00000000-0000-0000-0000-000000000000",
			persianMissionDate: $('#mission_date').val(),
			persianTimeFrom: $('#mission_hourStart').val(),
			persianTimeTo: $('#mission_hourFinish').val(),
			projectID: $("#mission_selectProject").data("kendoDropDownList").value(),
		};

		if (!mission.persianMissionDate.length) {
			$("span[for='mission_date']").text("تاریخ ضروری است");
			return;
		}
		if (!mission.persianTimeFrom.length) {
			$("span[for='mission_hourStart']").text("ساعت شروع ضروری است");
			return;
    }
    if (!mission.persianTimeTo.length) {
			$("span[for='mission_hourFinish']").text("ساعت پایان ضروری است");
			return;
		}


		if (!mission.projectID.length) mission.projectID = "00000000-0000-0000-0000-000000000000";

		moduleData.service.saveHourlyMission(mission, () => {

      moduleData.period_next_pervious.GetCurrentPeriod();
			private_closeWindow();
      moduleData.common.notify("ثبت ماموریت ساعتی با موفقیت انجام شد", "success");
      
		});
	}

  return {
    init: init
  };

})();

module.exports = {
  init: hm.init
};
},{}],17:[function(require,module,exports){
//_________صفحه بعد و قبل 
const period_next_pervious = (function () {

    const moduleData = {};

    function init(common, common_register, mainGrid, monthlyGrid,
        history_sentWorkHour, priodlyGrid, editWindow, data, service,serviceConfirm) {

        moduleData.common_register = common_register;
        moduleData.common = common;
        moduleData.mainGrid = mainGrid;
        moduleData.monthlyGrid = monthlyGrid;
        moduleData.history_sentWorkHour = history_sentWorkHour;
        moduleData.priodlyGrid = priodlyGrid;
        moduleData.editWindow = editWindow;
        moduleData.data = data;
        moduleData.service = service;
        moduleData.serviceConfirm = serviceConfirm;

        $('#btnpreviousPeriod').off().on('click', function () {
            GetNextPeriod('previous');
        });

        $('#btnSelectPeriod').off().on('click', function () {
            moduleData.common.openWindow('kwndSelectTimePeriod');
        });

        $('#btnNextPeriod').off().on('click', function () {
            GetNextPeriod('next');
        });

        //دو تا دکمه تایید و کنسل در فرمی که تعداد روزهای صفحه را مشخص می کنه
        $('#btnSendPeriod_determinPeriod').off().on('click', function () {
            btnSendPeriods_Onclick();
        });

        $('#btnCancel_determinPeriod').off().on('click', function () {
            kwndSelectPeriod_OnClose();
        });


        //دو تا کمبو تعداد روز هایی که در دوره نشان بده
        $('input:radio[name="optperiod"]').change(function () {

            EnableAndDisableSendPeriodRadioButton(this);

        });

        $("#numberDays").keyup(function () {

            if ($("#numberDays").val() > 25) {
                $("#numberDays").val("25");
            }
        });

    }

    function EnableAndDisableSendPeriodRadioButton() {
        if ($("#numberDays").is(':disabled')) {

            $("#numberDays").prop("disabled", false);
            $("#startDate").prop("disabled", false);

        } else {
            $("#numberDays").prop("disabled", true);
            $("#startDate").prop("disabled", true);
        }

    }

    function GetNextPeriod(type) {
        moduleData.common.loaderShow();

        let prmData = moduleData.data.timeSheetData_get()[0].values[moduleData.data.timeSheetData_get()[0].values.length - 1];

        if (type == 'previous') {
            prmData = moduleData.data.timeSheetData_get()[0].values[0];
        }

        moduleData.service.getNextTimeSheets(type, prmData.date, (response) => {

            moduleData.mainGrid.ResetAllThings();
            moduleData.mainGrid.Init_TimeSheetTreeList();

        });
    }



    function GetCurrentPeriod() {

        moduleData.mainGrid.RefreshTimeSheet(false);

        // moduleData.common.loaderShow();

        // var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values);

        // $.ajax({
        //     type: "Post",
        //     url: "/api/TimeSheetsAPI/GetCurrentPeriod",
        //     contentType: "application/json; charset=utf-8",
        //     dataType: "json",
        //     data: prmData,
        //     success: function (response) {

        //         moduleData.data.timeSheetData_set(response);
        //         moduleData.common_register.removeAndRecreateTreelisDiv();
        //         moduleData.mainGrid.Init_TimeSheetTreeList();
        //         moduleData.editWindow.Refresh_GrdEditWorkHour();
        //         moduleData.history_sentWorkHour.Refresh_GrdMonitorSentWorkHour();
        //         moduleData.priodlyGrid.InitPeriodlyByProjectsGrid();
        //         moduleData.monthlyGrid.InitMonthlyByProjectsGrid();
        //         moduleData.common.loaderHide();
        //     },
        //     error: function (e) {

        //     }
        // });
    }

    function kwndSelectPeriod_OnClose() {
        $("#kwndSelectTimePeriod").data("kendoWindow").close()
    }

    /////----------------- دکمه تایید تعداد روزهای دوره که باید نشان بده 

    function btnSendPeriods_Onclick() {
        moduleData.common.loaderShow();
        kwndSelectPeriod_OnClose();


        if ($('#chkweekly').is(':checked')) {

            moduleData.serviceConfirm.changeDisplayPeriodToWeeklyConfirm(() => {
                moduleData.mainGrid.RefreshTimeSheet(true);
            });

        }
        else {
            var PeriodJson = {
                Date: $("#startDate").val(),
                Days: $("#numberDays").val(),
                IsWeekly: false
            };

            var prmData = JSON.stringify(PeriodJson);

            moduleData.serviceConfirm.changeDisplayPeriodToDaily(prmData, () => {
                moduleData.mainGrid.RefreshTimeSheet(true);
            });
        }

    }

    return {
        init: init,
        GetCurrentPeriod: GetCurrentPeriod
    };
})();




module.exports = {
    "init": period_next_pervious.init,
    "GetCurrentPeriod": period_next_pervious.GetCurrentPeriod
}
},{}],18:[function(require,module,exports){
// const common_register = require('./common');
// const data = require('./data');

// ________________ارسال تایم شیت
const sendWorkHour = (function () {

	const moduleData={};

	function init(mainGrid, common, common_register, data, common_timeSheet) {
		moduleData.mainGrid = mainGrid;
		moduleData.common = common;
		moduleData.data = data;
		moduleData.common_register = common_register;
		moduleData.common_timeSheet = common_timeSheet;

		$('#btn_sendAllWorkHoursClick').off().on('click',function(){
			SendAllWorkHours_OnClick();
		});
		$('#btn_wndSendWorkHourClose').off().on('click',function(){
			wndSendWorkHour_OnClose();
		});
	}

	function wndSendWorkHour_OnClose() {
		$("#wndSendWorkHour").data("kendoWindow").close()
	}

	function GRDSendWorkHours_onInit(dayIndex) {

		var timeSheetData = moduleData.data.timeSheetData_get();
        moduleData.data.selDate_set(timeSheetData[0].values[dayIndex]);

		$("#SenddateTitle").text(moduleData.data.selDate_get().persianDate);

		var workHourJson = {
			ID: null,
			Date: moduleData.data.selDate_get().date,
		};
		var prmData = JSON.stringify(workHourJson);
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetUnConfirmedWorkHours",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: function (response) {
				_AllReadyForSent = 0
				for (var i = 0; i < response.length; i++) {
					const item = response[i];
					item.time = moduleData.common_timeSheet.convertMinutsToTime(item.minutes);
					_AllReadyForSent = _AllReadyForSent + item.minutes
				}
				$("#SumReadyForSentWorkHours").text(moduleData.common_timeSheet.convertMinutsToTime(_AllReadyForSent));

				$.ajax({
					type: "Post",
					url: "/api/TimeSheetsAPI/GetPresenceHourByDate",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					data: prmData,
					success: function (response) {
						_presenceHour =  moduleData.common_timeSheet.convertMinutsToTime(response.minutes);

						$("#presenceHour").text(_presenceHour);

					},
					error: function (e) {
					}
				});
				$.ajax({
					type: "Post",
					url: "/api/TimeSheetsAPI/GetConfirmedWorkHours",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					data: prmData,
					success: function (response) {
						_AllSentCount = 0
						for (var i = 0; i < response.length; i++) {
							_AllSentCount = _AllSentCount + response[i].minutes
						}
						$("#SumSentWorkHours").text(moduleData.common_timeSheet.convertMinutsToTime(_AllSentCount));
						$("#GRDSendWorkHours").data("kendoGrid").dataSource.read();
					},
					error: function (e) {

					}
				});
				_SendWorkHourGrid = response;

				$("#GRDSendWorkHours").kendoGrid({
					dataSource: {
						transport: {
							read: function (e) {
								e.success(_SendWorkHourGrid)
							}
						},
						pageSize: 20
					},
					height: 400,
					pageable: true,
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
						title: "ارسال ",
						template: "<button  type='button' class='btn btn-success btn-sm forFound_SendWorkHour_OnClick' name='info' title='ارسال' > ارسال</button>",
						headerTemplate: "<label class='text-center'> ارسال </label>",
						filterable: false,
						sortable: false,
						width: 100
					},
					{
						title: "حذف ",
						template: "<button type='button' class='btn btn-danger btn-sm forFound_DeleteWorkHourSendGrid' name='info' title='حذف' > حذف</button>",
						headerTemplate: "<label class='text-center'> حذف </label>",
						filterable: false,
						sortable: false,
						width: 100
					},
					],
					dataBound: GRDSendWorkHours_DataBound
				});

			},
			error: function (e) {

			}
		});
	}

	function GRDSendWorkHours_DataBound(e){
		$('.forFound_DeleteWorkHourSendGrid').off().on('click',function(event){
			DeleteWorkHourSendGrid(this);
		});
		$('.forFound_SendWorkHour_OnClick').off().on('click',function(event){
			SendWorkHour_OnClick(this);
		});
	}

	function wndSendWorkHour_OnInit(dayIndex) {

		moduleData.data.dayIndex_set(dayIndex);

		var wndSendWorkHour = $("#wndSendWorkHour");
		wndSendWorkHour.kendoWindow({
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

		GRDSendWorkHours_onInit(moduleData.data.dayIndex_get());
	}

	function SendAllWorkHours_OnClick() {

		var dayIndex = moduleData.data.dayIndex_get();
		var timeSheetData = moduleData.data.timeSheetData_get();
		moduleData.data.selDate_set(timeSheetData[0].values[dayIndex]);
		
		var workHourJson = {
			ID: null,
			Date: moduleData.data.selDate_get().date,
		};
		var prmData = JSON.stringify(workHourJson);
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/SendWorkHours",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: function (response) {
				_AllSentCount = 0

				for (var i = 0; i < response.length; i++) {
					const item = response[i];
					item.time = moduleData.common_timeSheet.convertMinutsToTime(item.minutes);
					_AllSentCount = _AllSentCount + item.minutes
				}
				$("#SumSentWorkHours").text(_AllSentCount);
				for (var i = 0; i < response.length; i++) {
					if (response[0] == "عملیات ارسال کارکرد ها با موفقیت انجام گردید") {
						moduleData.common.notify(response[i], "success");
					} else {
						moduleData.common.notify(response[i], "danger");
					}
				}
				moduleData.mainGrid.RefreshTimeSheet();
				wndSendWorkHour_OnClose();

			},
			error: function (e) {

			}
		});
	}

	function SendWorkHour_OnClick(e) {
		var grid = $("#GRDSendWorkHours").data("kendoGrid");
		var dataItem = grid.dataItem($(e).closest("tr"));


		var workHourJson = {
			ID: dataItem.id,
			Date: moduleData.data.selDate_get().date,
		};

		var prmData = JSON.stringify(workHourJson);
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/SendWorkHour",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: function () {
				//wndSendWorkHour_OnClose();
				Refresh_GRDSendWorkHour();
				moduleData.mainGrid.RefreshTimeSheet();
				moduleData.common.notify("انجام عملیات  ارسال با موفقیت به انجام رسید.", "success");
			},
			error: function (e) {

			}
		});

	}

	function DeleteWorkHourSendGrid(e) {
		var grid = $("#GRDSendWorkHours").data("kendoGrid");
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
				Refresh_GRDSendWorkHour();
				moduleData.mainGrid.RefreshTimeSheet();
				moduleData.common.loaderHide();
			},
			error: function (e) {
				alert(dataItem.ID);
			}
		});
	}

	function Refresh_GRDSendWorkHour() {
		var workHourJson = {
			ID: null,
			Date: moduleData.data.selDate_get().date,
		};

		var prmData = JSON.stringify(workHourJson);

		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetUnConfirmedWorkHours",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: function (response) {
				_AllReadyForSent = 0

				for (var i = 0; i < response.length; i++) {
					const item = response[i];
					item.time = moduleData.common_timeSheet.convertMinutsToTime(item.minutes);
					_AllReadyForSent = _AllReadyForSent + item.minutes
				}
				$("#SumReadyForSentWorkHours").text(moduleData.common_timeSheet.convertMinutsToTime(_AllReadyForSent));
				$.ajax({
					type: "Post",
					url: "/api/TimeSheetsAPI/GetPresenceHourByDate",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					data: prmData,
					success: function (response) {
						_presenceHour = moduleData.common_timeSheet.convertMinutsToTime(response.minutes);

						$("#presenceHour").text(_presenceHour);

					},
					error: function (e) {

					}
				});
				$.ajax({
					type: "Post",
					url: "/api/TimeSheetsAPI/GetConfirmedWorkHours",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					data: prmData,
					success: function (response) {
						_AllSentCount = 0
						for (var i = 0; i < response.length; i++) {
							_AllSentCount = _AllSentCount + response[i].minutes
						}
						$("#SumSentWorkHours").text(moduleData.common_timeSheet.convertMinutsToTime(_AllSentCount));
						$("#GRDSendWorkHours").data("kendoGrid").dataSource.read();
					},
					error: function (e) {

					}
				});
				_SendWorkHourGrid = response;
				$("#GRDSendWorkHours").data("kendoGrid").dataSource.read();
			},
			error: function (e) {

			}
		});


	}

	return {
		init: init,
		wndSendWorkHour_OnInit: wndSendWorkHour_OnInit
	}

})();



module.exports = {
	'wndSendWorkHour_OnInit': sendWorkHour.wndSendWorkHour_OnInit,
	init: sendWorkHour.init
};

},{}],19:[function(require,module,exports){

var service = (function () {

  const moduleData = {};

  function init(data, common_timeSheet, common) {
    moduleData.data = data;
    moduleData.common_timeSheet = common_timeSheet;
    moduleData.common = common;
  }


  //اون اول اطلاعات کل تایم شیت ها را می دهد
  function getTimeSheets(fromDate, toDate, success_callBack, error_callBack) {

    let url = "/api/timesheetsNew/" + moduleData.common.version() + "/employee";

    if (fromDate) {
      url = `/api/timesheetsNew/${moduleData.common.version()}/employeeTimeSheet/${fromDate}/${toDate}`;
    }

    $.ajax({
      type: "Get",
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",

      success: function (response) {

        moduleData.data.timeSheetData_beforProcess_set(response);

        var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForEmployee(response);

        moduleData.data.timeSheetData_set(data);
        if (success_callBack) success_callBack(data);
      },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }

  function getNextTimeSheets(type, date, success_callBack, error_callBack) {

    $.ajax({
      type: "Get",
      url: `/api/timesheetsNew/${moduleData.common.version()}/employee/${type}/${date}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",

      success: function (response) {

        var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForEmployee(response);

        moduleData.data.timeSheetData_set(data);
        if (success_callBack) success_callBack(data);
      },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }


  function saveWorkHours(prmData, success_callBack, error_callBack) {
    $.ajax({
      type: "Post",
      url: "/api/TimeSheetsAPI/SaveWorkHours",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: prmData,
      success: success_callBack ? (response) => success_callBack(response) : () => { },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }

  function deleteWorkHour(workHourId, success_callBack, error_callBack) {
    $.ajax({
      type: "Post",
      url: "/api/TimeSheetsAPI/DeleteWorkHours",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({ id: workHourId }),
      success: success_callBack ? (response) => success_callBack(response) : () => { },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }


  function getUserProjects(success_callBack, error_callBack) {
    $.ajax({
      type: "Get",
      url: "/api/ProjectsAPI/GetProjects",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response) {
        moduleData.data.userProjects_set(response);
        if (success_callBack) success_callBack(response);
      },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }


  function getUsers(success_callBack, error_callBack) {
    $.ajax({
      type: "Get",
      url: "/api/timesheetsNew/GetUsersList",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response) {
        moduleData.data.users_set(response);
        if (success_callBack) success_callBack(response);
      },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }

  function saveDailyLeave(dailyLeave, success_callBack, error_callBack) {
    $.ajax({
      type: "Post",
      url: "/api/timesheetsNew/SaveDailyLeave",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(dailyLeave),
      success: success_callBack ? (response) => success_callBack(response) : () => { },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }

  function saveHourlyLeave(hourlyLeave, success_callBack, error_callBack) {
    $.ajax({
      type: "Post",
      url: "/api/timesheetsNew/SaveHourlyLeave",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(hourlyLeave),
      success: success_callBack ? (response) => success_callBack(response) : () => { },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }

  function saveHourlyMission(hourlyMission, success_callBack, error_callBack) {
    $.ajax({
      type: "Post",
      url: "/api/timesheetsNew/SaveHourlyMission",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(hourlyMission),
      success: success_callBack ? (response) => success_callBack(response) : () => { },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }
  

  return {
    init: init,

    getTimeSheets: getTimeSheets,
    saveWorkHours: saveWorkHours,
    deleteWorkHour: deleteWorkHour,

    getNextTimeSheets: getNextTimeSheets,

    getUserProjects: getUserProjects,
    getUsers: getUsers,

    saveDailyLeave: saveDailyLeave,
    saveHourlyLeave: saveHourlyLeave,
    saveHourlyMission: saveHourlyMission
  };

})();



module.exports = {
  init: service.init,

  getTimeSheets: service.getTimeSheets,
  saveWorkHours: service.saveWorkHours,
  deleteWorkHour: service.deleteWorkHour,

  getNextTimeSheets: service.getNextTimeSheets,

  getUserProjects:service.getUserProjects,
  getUsers:service.getUsers,

  saveDailyLeave: service.saveDailyLeave,
  saveHourlyLeave: service.saveHourlyLeave,
  saveHourlyMission: service.saveHourlyMission
}
},{}]},{},[4]);
