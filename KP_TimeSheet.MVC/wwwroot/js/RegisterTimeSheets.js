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

        const hozoorDetail = new timeSheet_Row(2, 1, "جزئیات", "-", "eb96abcb-d37d-4aa1-1002-e1f4a753bee5", []);
        data.push(hozoorDetail);

        const karkard = new timeSheet_Row(3, null, "کارکرد", "-", "eb96abcb-d37d-4aa1-1003-e1f4a753bee5", []);
        data.push(karkard);

        const diffHozoorKarkard = new timeSheet_Row(4, null, "اختلاف حضور و کارکرد", "-", "eb96abcb-d37d-4aa1-1004-e1f4a753bee5", []);
        data.push(diffHozoorKarkard);

        const projects = [];
        const times = private_findTimesAndProjects(response, hozoor, hozoorDetail, karkard, diffHozoorKarkard, projects, null);

        private_addProjectsAndTasksTimes(data, times, projects, 3);

        const notSendId = data.length + 1
        const karkard_notSend = new timeSheet_Row(notSendId, null, "ارسال نشده", "-", "eb96abcb-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_notSend);



        const projects_notSendByEmployee = [];
        const times_notSend = private_findTimesAndProjects(response, null, null, karkard_notSend,null, projects_notSendByEmployee, "Resource");

        private_addProjectsAndTasksTimes(data, times_notSend, projects_notSendByEmployee, notSendId, true);


        const projects_approving = [];
        const times_approve = private_findTimesAndProjects(response, null, null, null, null, projects_approving, "Approving");

        const projects_final = [];
        const times_final = private_findTimesAndProjects(response, null, null, null, null, projects_final, "Final");

        private_addTimesForAmaliat(hozoor, karkard_notSend, karkard, amaliat);

        return data;
    }

    function private_addTimesForAmaliat(hozoor, noSend, mainKarkard, amalit) {

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
                value: {isOpen: hozoorTodayTime.isOpen, has_NotSendData: !!nosendTodayTime.minute, hasKarkard: !!mainKarkardTodayTime.minute} 
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
        const times = private_findTimesAndProjects(response, hozoor, hozoorDetail, karkard,null, projects, null);

        private_addProjectsAndTasksTimes(data, times, projects, 3);

        const taeedNashodeId = data.length + 1
        const karkard_notApprove = new timeSheet_Row(taeedNashodeId, null, "تایید نشده", "-", "eb96abcb-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_notApprove);

        const projects_notApprove = [];
        const times_notApprove = private_findTimesAndProjects(response, null, null, karkard_notApprove,null, projects_notApprove, "TaskNotApprove");

        private_addProjectsAndTasksTimes(data, times_notApprove, projects_notApprove, taeedNashodeId, true);

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



    function private_findTimesAndProjects(response, hozoor, hozoorDetail, karkard, diffHozoorKarkard, projects, wantedState) {

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
                value: convertNumberToTime(cTime.calcTime()),
                minute: cTime.calcTime()
            });
            if(diffHozoorKarkard) diffHozoorKarkard.values.push({
                date: cTime.date,
                persianDate: cTime.persianDate,
                persianDay: cTime.persianDay,
                title: cTime.persianDate,
                value: convertNumberToTime(dbTime.hozoor - cTime.calcTime()),
                minute: dbTime.hozoor - cTime.calcTime()
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
const common_register = require('./common');
const data = require('./data');
const createNewWorkHour = require('./createNewWorkHour');
const mainGrid = require('./mainGrid');
const priodlyGrid = require('./bottomPage_priodlyGrid');
const bottomPage_monthlyGrid = require('./bottomPage_monthlyGrid');


const period_next_pervious = require('./period_next_pervious');
const history_sentWorkHour =require('./history_sentWorkHour');
const editWindow=require('./editWorkHour');
const history_workHour = require('./hisotory_workHour');
const sendWorkHour = require('./sendWorkHour');

const common_timeSheet = require('../common/timesheet');

const service = require('./service');




// Document Ready__________

$(document).ready(function () {

    common.loaderShow();

    data.init();
    bottomPage_monthlyGrid.init(data);
    priodlyGrid.init(data);
    service.init(data, common_timeSheet);

    $('#registerTiemSheet_exportToExcel').off().on('click',function(){
        common.doExport('#ktrlTimeSheets', {type: 'excel'});
    });
    $('#registerTiemSheet_exportToDoc').off().on('click',function(){
        common.doExport('#ktrlTimeSheets', { type: 'doc' });
    });
    
    mainGrid.init(common, common_register, createNewWorkHour,history_sentWorkHour,sendWorkHour,data, service);

    mainGrid.GetTimeSheets(function(){
        priodlyGrid.InitPeriodlyByProjectsGrid();
        bottomPage_monthlyGrid.InitMonthlyByProjectsGrid();
        common.loaderHide();
        
        period_next_pervious.init(common, common_register,mainGrid,
            bottomPage_monthlyGrid,history_sentWorkHour, priodlyGrid,editWindow, data, service);
            
        editWindow.init(mainGrid, common, common_register,data);
        
        createNewWorkHour.init(common,common_register,period_next_pervious,data,service);
        sendWorkHour.init(mainGrid, common, common_register,data);
        
        history_workHour.init(common, data);
        history_sentWorkHour.init(common,common_register,history_workHour,data);
    });
});




function exportTableToExcel(tableID, filename ){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}






},{"../common/common":1,"../common/timesheet":2,"./bottomPage_monthlyGrid":4,"./bottomPage_priodlyGrid":5,"./common":6,"./createNewWorkHour":7,"./data":8,"./editWorkHour":9,"./hisotory_workHour":10,"./history_sentWorkHour":11,"./mainGrid":12,"./period_next_pervious":13,"./sendWorkHour":14,"./service":15}],4:[function(require,module,exports){
//const data = require('./data');

//___________جدول پایین صفحه ماهانه

const monthlyGrid =(function(){

    const moduleData={};

    function init(data){
        moduleData.data = data;
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
                moduleData.data.thisMonthdata_set(response);
                $("#MonthlyPresence").text(response.presence);
                $("#MonthlyWorkHour").text(response.work);
                $("#MonthlyDefference").text(response.defference);
                $("#MonthlyPresencePercent").width(response.presencepercent);
                $("#MonthlyWorkHourPercent").width(response.workpercent);
                $("#MonthlyDefferencePercent").width(response.defferencepercent);
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
},{}],5:[function(require,module,exports){
//const data = require('./data');
//___________________دوره جاری جدول پایین صفحه 

const priodGrid = (function () {

    const moduleData={};

    function init(data) {
        moduleData.data = data;
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
                $("#LblperHourCurrPeriod").text(response.presence);
                $("#LblworkHourCurrPeriod").text(response.work);
                $("#LblPeriodicallyDefference").text(response.defference);
                $("#PRBperHourCurrPeriod").width(response.presencepercent);
                $("#PRBworkHourCurrPeriod").width(response.workpercent);
                $("#PRGPeriodicallyDefferencePercent").width(response.defferencepercent);
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
},{}],6:[function(require,module,exports){


function removeAndRecreateTreelisDiv() {
    $("#ktrlTimeSheets").data("kendoTreeList").destroy();
    $("#ktrlTimeSheets").remove();
    $("#KTLContainer").append("<div id='ktrlTimeSheets'></div>");
}

module.exports={
    'removeAndRecreateTreelisDiv':removeAndRecreateTreelisDiv
}
},{}],7:[function(require,module,exports){
// const common = require('../common/common');
// const common_register = require('./common');
// const data = require('./data');
// const period_next_pervious = require('./period_next_pervious');
// const mainGrid = require('./mainGrid');


//_____________________پنجره ذخیره
const module_createNewRorkHour =(function(){

    const moduleData={};

    function init(common,common_register,period_next_pervious,data, service){
        moduleData.common = common;
        moduleData.common_register = common_register;
        moduleData.period_next_pervious = period_next_pervious;
        moduleData.data = data;
        moduleData.service = service;

        $('#btnCancel_kwndSaveWHs').off().on('click',function(){
            kwndSaveWHs_OnClose();
        });
        $('#btnSaveWorkHours_kwndSaveWHs').off().on('click',function(){
            btnSaveWorkHours_Onclick();
        });
    }
    
    function kwndSaveWHs_OnInit(dayIndex) {
    
        var timeSheetData = moduleData.data.timeSheetData_get();
        moduleData.data.selDate_set(timeSheetData[0].values[dayIndex]);

        GetProjects();
    }
    
    function kwndSaveWHs_OnClose() {
        var w= $("#kwndSaveWorkHours").data("kendoWindow");
        if(w) w.close();
    }
    
    function GetProjects() {
        $.ajax({
            type: "Get",
            url: "/api/ProjectsAPI/GetProjects",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: ddlProjects_OnInit,
            error: function (e) {
    
            }
        });
    }
    
    function ddlProjects_OnInit(response) {
    
        if (response.length == 0 ) {
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
            var kwndSaveWHs = $("#kwndSaveWorkHours");

            

            kwndSaveWHs.kendoWindow({
                width: "500px",
                height: moduleData.common.window_height(),

                activate: moduleData.common.addNoScrollToBody,
                deactivate: moduleData.common.removeNoScrollToBody ,
    
                scrollable: false,
                visible: false,
                modal: true,
                actions: [
                    "Pin",
                    "Minimize",
                    "Maximize",
                    "Close"
                ],
                open: moduleData.common.adjustSize,
                close: ResetSaveWindow
            }).data("kendoWindow").center().open();
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
            success: ddlTasks_OnInit,
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
            ID: null,
            Date: moduleData.data.selDate_get().date,
            EmployeeID: null,
            TaskID: $("#ddlTasks").data("kendoDropDownList").value(),
            Hours: $("#ktpWorkHour").data("kendoTimePicker")._oldText,
            ProjectID: $("#ddlProjects").data("kendoDropDownList").value(),
            Description: $("#txtDescription").val()
        };
    
        if (!workHourJson.TaskID) {
            $("span[for='ddlTasks']").text("وظیفه ضروری است");
            return;
        }
    
        if (!workHourJson.Hours) {
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
        if(response.lenth > 0){
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
    }

    return {
        kwndSaveWHs_OnInit : kwndSaveWHs_OnInit,
        init: init
    };

})();




module.exports={
    
    'kwndSaveWHs_OnInit':module_createNewRorkHour.kwndSaveWHs_OnInit,
    'init':module_createNewRorkHour.init
}
},{}],8:[function(require,module,exports){
const dataM = (function () {

    const moduleData = {};

    function init() {
        moduleData._SelDate = {};
        moduleData.CurrentUser = {};
        moduleData._TimeSheetData = [];
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

    'todayHistory_get': function () { return dataM.moduleData._TodayHistorys; },
    'todayHistory_set': function (data) { dataM.moduleData._TodayHistorys = data; },

    'thisMonthdata_get': function () { return dataM.moduleData._thisMonthdata; },
    'thisMonthdata_set': function (data) { dataM.moduleData._thisMonthdata = data; },

    'workHours_get': function () { return dataM.moduleData._WorkHours; },
    'workHours_set': function (data) { dataM.moduleData._WorkHours = data; },

    'dayIndex_get': function () { return dataM.moduleData._DayIndex; },
    'dayIndex_set': function (data) { dataM.moduleData._DayIndex = data; },
}
},{}],9:[function(require,module,exports){
// const data = require('./data');
// const common_register = require('./common');

//____________ویرایش
const editWorkHour = (function () {

	const moduleData={};

	function init(mainGrid, common,common_register, data) {
		moduleData.mainGrid = mainGrid;
		moduleData.common = common;
		moduleData.common_register = common_register;
		moduleData.data = data;

		$('#btnEditWorkHour').off().on('click', function () {
			WndEditWorkHours_OnInit();
		});

		$('#btn_Close_WndEditWorkHours').off().on('click', function () {
			Close_WndEditWorkHours();
		});

	}

	function WndEditWorkHours_OnInit() {
		GetWorkHours_GrdEditWorkHour();

		var kwndSaveWHs = $("#WndEditWorkHours");
		kwndSaveWHs.kendoWindow({
			width: "900px",
			height: "650",

			scrollable: false,
			visible: false,
			modal: true,
			actions: [
				"Pin",
				"Minimize",
				"Maximize",
				"Close"
			],
			open: moduleData.common.adjustSize,
		}).data("kendoWindow").center().open();
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
			height: 520,
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

	function GrdEditWorkHour_DataBound(e){
		$('.forFound_DeleteWorkHourEditGrid').off().on('click',function(){
			DeleteWorkHourEditGrid(this);
		});
	}

	function DeleteWorkHourEditGrid(e) {

		var grid = $("#GrdEditWorkHour").data("kendoGrid");
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
				Refresh_GrdEditWorkHour();

				moduleData.mainGrid.RefreshTimeSheet();
				moduleData.common.loaderHide();
			},
			error: function (e) {
				alert(dataItem.ID);
			}
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
},{}],10:[function(require,module,exports){
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
				field: "PersianDate",
				title: "تاریخ",
				width: 80
			},
			{
				field: "Time",
				title: "ساعت",
				width: 80
			},
			{
				field: "ManagerName",
				title: "نام مدیر",
				width: 200
			}, {
				field: "Action",
				title: "عملیات",
				width: 120
			}, {
				field: "StageTitle",
				title: "مرحله",
				width: 120

			}, {
				field: "Description",
				title: "توضیحات",
				width: 400

			}
			]

		});
	}

	function ShowHistory() {
		$("#PanelMonitorWorkHour").fadeOut(400);
		$("#PanelHistory").fadeIn(400);
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
},{}],11:[function(require,module,exports){
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
			open: moduleData.common.adjustSize,
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
		moduleData.common.loaderShow();
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
		ShowCurrentDaySendWorkHours: ShowCurrentDaySendWorkHours
	};

})();



module.exports = {
	'Refresh_GrdMonitorSentWorkHour': hisotrSentWorkHour.Refresh_GrdMonitorSentWorkHour,
	'Init_GrdMonitorSentWorkHour': hisotrSentWorkHour.Init_GrdMonitorSentWorkHour,
	'init': hisotrSentWorkHour.init,
	'ShowCurrentDaySendWorkHours': hisotrSentWorkHour.ShowCurrentDaySendWorkHours
}

},{}],12:[function(require,module,exports){
const myMainGrid = (function () {

  const moduleData = {};

  function init(common, common_register, createNewWorkHour, history_sentWorkHour, sendWorkHour, data, service) {
    moduleData.common = common;
    moduleData.common_register= common_register;
    moduleData.data = data;
    moduleData.history_sentWorkHour = history_sentWorkHour;
    moduleData.createNewWorkHour = createNewWorkHour;
    moduleData.sendWorkHour = sendWorkHour;
    moduleData.service = service;

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

  function RefreshTimeSheet() {
    GetTimeSheets(()=>{
      moduleData.common_register.removeAndRecreateTreelisDiv();
      moduleData.common.loaderHide();
    });
  }
  //----------

  function GetTimeSheets(callBackFn) {

    moduleData.service.getTimeSheets((response) => {
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
      alert("Satr: " + dataItem.title + " - Sotoon: " + dataItem.values[cellIndex - 3].title);
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
      //colDate.field = "values[" + i + "].value";
      colDate.template="#= type=='Defference' ? '<span title=\"تایید شده\">1:00</span> | <span title=\"برگشت شده\">2:00</span>' :  (values[ "+i+" ].value) #";
      colDate.format = "";
      colDate.title = tsDate.title;
      colDate.headerTemplate = "<h6 style='text-align:center'><b>" + tsDate.persianDate + "</b></h6><h6 style='text-align:center'>" + tsDate.persianDay + "</h6>";


      var inner = tsDate.value;

      colDate.headerTemplate +="<div style='text-align:center'>";

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
      colDate.headerTemplate +="</div>";

      colDate.hidden = false;
      colDate.width = 100;
      columns.push(colDate);
    }

    return columns;
  }

  function ktrlTimeSheets_DataBound(e) {

    $('.forFound_kwndSaveWHs_OnInit').off().on('click', function () {
      var id = $(this).data("dayIndex");
      moduleData.createNewWorkHour.kwndSaveWHs_OnInit(id);
    });

    $('.forFound_ShowCurrentDaySendWorkHours').off().on('click', function () {
      var sendId = $(this).data("dayIndex");
      moduleData.history_sentWorkHour.ShowCurrentDaySendWorkHours(sendId);
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
    init: init
  };

})();




//________________

module.exports = {

  'GetTimeSheets': myMainGrid.GetTimeSheets,
  'Init_TimeSheetTreeList': myMainGrid.Init_TimeSheetTreeList,
  'RefreshTimeSheet':myMainGrid.RefreshTimeSheet,
  'init': myMainGrid.init

};
},{}],13:[function(require,module,exports){
//_________صفحه بعد و قبل 
const period_next_pervious = (function () {

    const moduleData = {};

    function init(common, common_register, mainGrid, monthlyGrid,
        history_sentWorkHour, priodlyGrid, editWindow, data, service) {

        moduleData.common_register = common_register;
        moduleData.common = common;
        moduleData.mainGrid = mainGrid;
        moduleData.monthlyGrid = monthlyGrid;
        moduleData.history_sentWorkHour = history_sentWorkHour;
        moduleData.priodlyGrid = priodlyGrid;
        moduleData.editWindow = editWindow;
        moduleData.data = data;
        moduleData.service = service;

        $('#btnpreviousPeriod').off().on('click', function () {
            GetNextPeriod('previous');
        });

        $('#btnSelectPeriod').off().on('click', function () {
            kwndSelectPeriod_OnInit();
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

            moduleData.common_register.removeAndRecreateTreelisDiv();
            moduleData.mainGrid.Init_TimeSheetTreeList();
            moduleData.editWindow.Refresh_GrdEditWorkHour();
            moduleData.history_sentWorkHour.Refresh_GrdMonitorSentWorkHour();
            moduleData.priodlyGrid.InitPeriodlyByProjectsGrid();
            moduleData.monthlyGrid.InitMonthlyByProjectsGrid();
            moduleData.common.loaderHide();

        });
    }



    function GetCurrentPeriod() {
        moduleData.common.loaderShow();

        var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values);

        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetCurrentPeriod",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: function (response) {

                moduleData.data.timeSheetData_set(response);
                moduleData.common_register.removeAndRecreateTreelisDiv();
                moduleData.mainGrid.Init_TimeSheetTreeList();
                moduleData.editWindow.Refresh_GrdEditWorkHour();
                moduleData.history_sentWorkHour.Refresh_GrdMonitorSentWorkHour();
                moduleData.priodlyGrid.InitPeriodlyByProjectsGrid();
                moduleData.monthlyGrid.InitMonthlyByProjectsGrid();
                moduleData.common.loaderHide();
            },
            error: function (e) {

            }
        });
    }



    function kwndSelectPeriod_OnInit() {

        var kwndSendWHs = $("#kwndSelectTimePeriod");
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
            open: moduleData.common.adjustSize,
        }).data("kendoWindow").center().open();
    }

    function kwndSelectPeriod_OnClose() {
        $("#kwndSelectTimePeriod").data("kendoWindow").close()
    }

    /////----------------- دکمه تایید تعداد روزهای دوره که باید نشان بده 

    function btnSendPeriods_Onclick() {
        moduleData.common.loaderShow();
        kwndSelectPeriod_OnClose();


        if ($('#chkweekly').is(':checked')) {
            $.ajax({
                type: "Get",
                url: "/api/TimeSheetsAPI/ChangeDisplayPeriodToWeekly",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    moduleData.data.timeSheetData_set(response);
                    moduleData.common_register.removeAndRecreateTreelisDiv();
                    moduleData.mainGrid.Init_TimeSheetTreeList();
                    moduleData.editWindow.Refresh_GrdEditWorkHour();
                    moduleData.history_sentWorkHour.Refresh_GrdMonitorSentWorkHour();
                    moduleData.common.loaderHide();
                },
                error: function (e) {

                }
            });

        }
        else {
            var PeriodJson = {
                Date: $("#startDate").val(),
                Days: $("#numberDays").val(),
                IsWeekly: false
            };

            var prmData = JSON.stringify(PeriodJson);

            $.ajax({
                type: "Post",
                url: "/api/TimeSheetsAPI/GetTimeSheetsByDateAndNumberOfDay",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: prmData,
                success: function (response) {
                    moduleData.data.timeSheetData_set(response);
                    moduleData.common_register.removeAndRecreateTreelisDiv();
                    moduleData.mainGrid.Init_TimeSheetTreeList();
                    moduleData.common.loaderHide();
                },
                error: function (e) {

                }
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
},{}],14:[function(require,module,exports){
// const common_register = require('./common');
// const data = require('./data');

// ________________ارسال تایم شیت
const sendWorkHour = (function () {

	const moduleData={};

	function init(mainGrid, common, common_register, data) {
		moduleData.mainGrid = mainGrid;
		moduleData.common = common;
		moduleData.data = data;
		moduleData.common_register = common_register;

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
					_AllReadyForSent = _AllReadyForSent + response[i].hours
				}
				$("#SumReadyForSentWorkHours").text(_AllReadyForSent);

				$.ajax({
					type: "Post",
					url: "/api/TimeSheetsAPI/GetPresenceHourByDate",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					data: prmData,
					success: function (response) {
						_presenceHour = response.hours;

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
							_AllSentCount = _AllSentCount + response[i].hours
						}
						$("#SumSentWorkHours").text(_AllSentCount);
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
						field: "hours",
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
			width: "750px",
			height: "670",

			scrollable: false,
			visible: false,
			modal: true,
			actions: [
				"Pin",
				"Minimize",
				"Maximize",
				"Close"
			],
			open: moduleData.common.adjustSize,
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
					_AllSentCount = _AllSentCount + response[i].Hours
				}
				$("#SumSentWorkHours").text(_AllSentCount);
				for (var i = 0; i < response.length; i++) {
					if (response[0] == "عملیات ارسال کارکرد ها با موفقیت انجام گردید") {
						moduleData.common.notify(response[i], "success");
					} else {
						moduleData.common.notify(response[i], "danger");
					}
				}

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
					_AllReadyForSent = _AllReadyForSent + response[i].Hours
				}
				$("#SumReadyForSentWorkHours").text(_AllReadyForSent);
				$.ajax({
					type: "Post",
					url: "/api/TimeSheetsAPI/GetPresenceHourByDate",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					data: prmData,
					success: function (response) {
						_presenceHour = response.Hour

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
							_AllSentCount = _AllSentCount + response[i].Hours
						}
						$("#SumSentWorkHours").text(_AllSentCount);
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

},{}],15:[function(require,module,exports){

var service = (function () {

    const moduleData = {};

    function init(data, common_timeSheet) {
        moduleData.data = data;
        moduleData.common_timeSheet = common_timeSheet;
    }


    //اون اول اطلاعات کل تایم شیت ها را می دهد
    function getTimeSheets(success_callBack, error_callBack) {

        $.ajax({
			type: "Get",
			url: "/api/Confirm/employee",
			contentType: "application/json; charset=utf-8",
			dataType: "json",

			success: function (response) {
                
				var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForEmployee(response);

                moduleData.data.timeSheetData_set(data);
                if (success_callBack) success_callBack(data);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
    }

    function getNextTimeSheets(type,date, success_callBack, error_callBack) {

        $.ajax({
			type: "Get",
			url: `/api/Confirm/employee/${type}/${date}`,
			contentType: "application/json; charset=utf-8",
			dataType: "json",

			success: function (response) {
                
				var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForEmployee(response);

                moduleData.data.timeSheetData_set(data);
                if (success_callBack) success_callBack(data);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
    }


    function saveWorkHours(prmData, success_callBack, error_callBack){
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/SaveWorkHours",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: success_callBack ? (response) => success_callBack(response) : ()=>{},
            error: error_callBack ? () => error_callBack() : () => { }
        });
    }

    return {
        init: init,

        getTimeSheets: getTimeSheets,
        saveWorkHours: saveWorkHours,

        getNextTimeSheets: getNextTimeSheets
    };

})();



module.exports = {
    init: service.init,

    getTimeSheets: service.getTimeSheets,
    saveWorkHours: service.saveWorkHours,

    getNextTimeSheets: service.getNextTimeSheets
}
},{}]},{},[3]);
