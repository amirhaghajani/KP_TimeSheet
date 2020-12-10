(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

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
        message:"<strong >"+ messege +"</strong>",
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

module.exports = {
    'LoaderShow': function () {
        $("#Loader").fadeIn(500);
    },
    'LoaderHide':function(){
        $("#Loader").fadeOut(500);
    },
    'Notify':notify,
    'doExport':doExport
};

},{}],2:[function(require,module,exports){
const common = require('../common/common');
const common_register = require('./common');
const data = require('./data');
const createNewWorkHour = require('./createNewWorkHour');
const mainGrid = require('./mainGrid');
const priodlyGrid = require('./bottomPage_priodlyGrid');
const monthlyGrid = require('./bottomPage_monthlyGrid');


const period_next_pervious = require('./period_next_pervious');
const history_sentWorkHour =require('./history_sentWorkHour');
const editWindow=require('./editWorkHour');
const history_workHour = require('./hisotory_workHour');
const sendWorkHour = require('./sendWorkHour');




// Document Ready__________

$(document).ready(function () {

    data.init();
    monthlyGrid.init(data);
    priodlyGrid.init(data);

    $('#registerTiemSheet_exportToExcel').off().on('click',function(){
        common.doExport('#ktrlTimeSheets', {type: 'excel'});
    });
    $('#registerTiemSheet_exportToDoc').off().on('click',function(){
        common.doExport('#ktrlTimeSheets', { type: 'doc' });
    });
    
    mainGrid.init(createNewWorkHour,history_sentWorkHour,sendWorkHour,data);

    mainGrid.GetTimeSheets(function(){
        priodlyGrid.InitPeriodlyByProjectsGrid();
        monthlyGrid.InitMonthlyByProjectsGrid();
        common.LoaderHide();
        period_next_pervious.init(common, common_register,mainGrid,
            monthlyGrid,history_sentWorkHour, priodlyGrid,editWindow, data);
            
        editWindow.init(common_register,data);
        history_sentWorkHour.init(common,common_register,history_workHour,data);
        createNewWorkHour.init(common,common_register,period_next_pervious,data);
        history_workHour.init(common, data);
        sendWorkHour.init(common_register,data);
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






},{"../common/common":1,"./bottomPage_monthlyGrid":3,"./bottomPage_priodlyGrid":4,"./common":5,"./createNewWorkHour":6,"./data":7,"./editWorkHour":8,"./hisotory_workHour":9,"./history_sentWorkHour":10,"./mainGrid":11,"./period_next_pervious":12,"./sendWorkHour":13}],3:[function(require,module,exports){
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
                $("#MonthlyPresence").text(response.Presence);
                $("#MonthlyWorkHour").text(response.Work);
                $("#MonthlyDefference").text(response.Defference);
                $("#MonthlyPresencePercent").width(response.Presencepercent);
                $("#MonthlyWorkHourPercent").width(response.Workpercent);
                $("#MonthlyDefferencePercent").width(response.Defferencepercent);
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
                field: "Title",
                title: "عنوان پروژه"
            }, {
                field: "Hour",
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
},{}],4:[function(require,module,exports){
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
                $("#LblperHourCurrPeriod").text(response.Presence);
                $("#LblworkHourCurrPeriod").text(response.Work);
                $("#LblPeriodicallyDefference").text(response.Defference);
                $("#PRBperHourCurrPeriod").width(response.Presencepercent);
                $("#PRBworkHourCurrPeriod").width(response.Workpercent);
                $("#PRGPeriodicallyDefferencePercent").width(response.Defferencepercent);
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
                field: "Title",
                title: "عنوان پروژه"
            }, {
                field: "Hour",
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
},{}],5:[function(require,module,exports){
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

function removeAndRecreateTreelisDiv() {
    $("#ktrlTimeSheets").data("kendoTreeList").destroy();
    $("#ktrlTimeSheets").remove();
    $("#KTLContainer").append("<div id='ktrlTimeSheets'></div>");
}

module.exports={
    'adjustSize': adjustSize,
    'removeAndRecreateTreelisDiv':removeAndRecreateTreelisDiv
}
},{}],6:[function(require,module,exports){
// const common = require('../common/common');
// const common_register = require('./common');
// const data = require('./data');
// const period_next_pervious = require('./period_next_pervious');
// const mainGrid = require('./mainGrid');


//_____________________پنجره ذخیره
const module_createNewRorkHour =(function(){

    const moduleData={};

    function init(common,common_register,period_next_pervious,data){
        moduleData.common = common;
        moduleData.common_register = common_register;
        moduleData.period_next_pervious = period_next_pervious;
        moduleData.data = data;

        $('#btnCancel_kwndSaveWHs').off().on('click',function(){
            kwndSaveWHs_OnClose();
        });
        $('#btnSaveWorkHours_kwndSaveWHs').off().on('click',function(){
            btnSaveWorkHours_Onclick();
        });
    }
    
    function kwndSaveWHs_OnInit(SaveWHsIdx) {
    
        debugger;

        // var ktrlTimeSheets = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($("#" + SaveWHsIdx).closest("tr"));
        // moduleData.data.selDate_set(ktrlTimeSheets.values[parseInt($("#" + SaveWHsIdx).attr('dayindex')) - 3]);

        moduleData.data.selDate_set(SaveWHsIdx);

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
            moduleData.common.Notify("کاربر گرامی شما فاقد پروژه میباشید", "danger");
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
                height: "640px",
    
                scrollable: false,
                visible: false,
                modal: true,
                actions: [
                    "Pin",
                    "Minimize",
                    "Maximize",
                    "Close"
                ],
                open: moduleData.common_register.adjustSize,
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
        
        $("span[for='ktpWorkHour']").text("");
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
    
    
        moduleData.common.LoaderShow();
    
        kwndSaveWHs_OnClose();
        var prmData = JSON.stringify(workHourJson);
    
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/SaveWorkHours",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: SaveWorkHours_OnSuccess,
            error: function (e) {
    
            }
        });
    }
    
    function SaveWorkHours_OnSuccess(response) {

        moduleData.period_next_pervious.GetCurrentPeriod();
        kwndSaveWHs_OnClose();
        if(response.lenth > 0){
            for (var i = 0; i < response.length; i++) {
                moduleData.common.Notify(response[i], "danger");
            } 
        }
        else {
            moduleData.common.Notify("ثبت کاکرد با موفقیت انجام شد", "success");
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
},{}],7:[function(require,module,exports){
const dataM = (function(){

    const moduleData={};

    function init(){
        moduleData._SelDate={};
        moduleData.CurrentUser={};
        moduleData._TimeSheetData = [];
        moduleData._WorkHourOnProjects = [];
        moduleData._thisMonthdata = {};
        moduleData._WorkHours = [];
        moduleData._SendItem = {};
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


module.exports={
    init:dataM.init,

    'selDate_get':function(){ return dataM.moduleData._SelDate;},
    'selDate_set':function(data){dataM.moduleData._SelDate = data;},

    'timeSheetData_get':function(){ return dataM.moduleData._TimeSheetData;},
    'timeSheetData_set':function(data){dataM.moduleData._TimeSheetData = data;},

    'todayHistory_get':function(){ return dataM.moduleData._TodayHistorys;},
    'todayHistory_set':function(data){dataM.moduleData._TodayHistorys = data;},

    'thisMonthdata_get':function(){ return dataM.moduleData._thisMonthdata;},
    'thisMonthdata_set':function(data){dataM.moduleData._thisMonthdata = data;},

    'workHours_get':function(){ return dataM.moduleData._WorkHours;},
    'workHours_set':function(data){dataM.moduleData._WorkHours = data;},

    'sendItem_get':function(){ return dataM.moduleData._SendItem;},
    'sendItem_set':function(data){dataM.moduleData._SendItem = data;},
}
},{}],8:[function(require,module,exports){
// const data = require('./data');
// const common_register = require('./common');

//____________ویرایش
const editWorkHour = (function () {

	const moduleData={};

	function init(common_register, data, mainGrid) {
		
		moduleData.common_register = common_register;
		moduleData.data = data;
		moduleData.mainGrid = mainGrid;

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
			open: moduleData.common_register.adjustSize,
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
				template: "<button  onclick='DeleteWorkHourEditGrid(this)' type='button' class='btn btn-danger btn-sm' name='info' title='حذف' > حذف</button>",
				headerTemplate: "<label class='text-center'> حذف </label>",
				filterable: false,
				sortable: false,
				width: 100
			},
			]

		});
	}

	function DeleteWorkHourEditGrid(e) {

		var grid = $("#GrdEditWorkHour").data("kendoGrid");
		var dataItem = grid.dataItem($(e).closest("tr"));


		common.LoaderShow();


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
				moduleData.common.LoaderHide();
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
},{}],9:[function(require,module,exports){
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

		moduleData.common.LoaderShow();

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
				moduleData.common.LoaderHide();
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
},{}],10:[function(require,module,exports){
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
			open: moduleData.common_register.adjustSize,
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

	function ShowCurrentDaySendWorkHours(SaveWHsIdx) {
		moduleData.common.LoaderShow();
		moduleData.hisotory_workHour.Create_GrdHistory();

		var ktrlTimeSheets = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($("#" + SaveWHsIdx).closest("tr"));
		moduleData.data.selDate_set(ktrlTimeSheets.values[parseInt($("#" + SaveWHsIdx).attr('dayindex')) - 3]);

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

				moduleData.common.LoaderHide();
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

},{}],11:[function(require,module,exports){
// const data = require('./data');
// const saveWindow = require('./createNewWorkHour');
// const history_sentWorkHour = require('./history_sentWorkHour');
// const sendWorkHour = require('./sendWorkHour');

const myMainGrid = (function () {

  const moduleData = {};

  function init(createNewWorkHour, history_sentWorkHour, sendWorkHour, data) {
    moduleData.data = data;
    moduleData.history_sentWorkHour = history_sentWorkHour;
    moduleData.createNewWorkHour = createNewWorkHour;
    moduleData.sendWorkHour = sendWorkHour;

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

  function GetTimeSheets(callBackFn) {

    $.ajax({
      type: "Get",
      url: "/api/TimeSheetsAPI/GetTimeSheets",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: (response) => ktrlTimeSheets_OnInit(response, callBackFn),
      error: function (e) {

      }
    });
  }

  function ktrlTimeSheets_OnInit(response, callBackFn) {
    moduleData.data.timeSheetData_set(response);
    Init_TimeSheetTreeList();

    if (callBackFn) callBackFn();

  }

  function Init_TimeSheetTreeList() {
    var ktrlTSColumns = ktrlTimeSheets_OnInitColumns(moduleData.data.timeSheetData_get());

    $("#ktrlTimeSheets").kendoTreeList({
      dataSource: {
        transport: {
          read: function (e) {
            e.success(moduleData.data.timeSheetData_get());
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
      columns: ktrlTSColumns,
      scrollable: true,
      selectable: true,
      dataBound: ktrlTimeSheets_DataBound
    });

    $("#ktrlTimeSheets").kendoTooltip({
      filter: 'td',
      content: function (e) {

        var treelist = $("#ktrlTimeSheets").data("kendoTreeList");
        var targetRow = $(e.target).closest('tr');
        var dataItem = treelist.dataItem(targetRow);
        return dataItem.title;
      }
    });
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

    debugger;

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

      colTitle.width = 150;
    columns.push(colTitle);

    for (var i = 0; i < response[0].values.length; i++) {

      var tsDate = response[0].values[i];
      var colDate = new KTRColumn();
      colDate.field = "values[" + i + "].value";
      colDate.format = "";
      colDate.title = tsDate.title;
      colDate.headerTemplate = "<h6> <b>" + tsDate.persianDate + "</b></h6>  <h6>" + tsDate.persianDay + "</h6>";

      var emlId = 'SaveWorkHours' + i;
      var semlId = 'SendWorkHours' + i;
      var sendId = 'ShowSent' + i;

      var inner = tsDate.value;
      if (inner == "False False") {
        colDate.headerTemplate += "<label title=' ' class='text-warning' ><i class='glyphicon glyphicon-ban-circle'></i> </label>"
      }

      if (inner == "True False" || inner == "True True") {

        colDate.headerTemplate += `<button title='ثبت ساعت کارکرد' id='${emlId}' 
                          class='btn btn-success btn-xs forFound_kwndSaveWHs_OnInit' style='width:10px;height:15px'
                           dayIndex='${i}' data-day-index='${i}'>+</button>`;

        colDate.headerTemplate += `<button title='نمایش کارکردهای این روز' id='${sendId}'  
              class='btn btn-info btn-xs forFound_ShowCurrentDaySendWorkHours' style='width:10px;height:15px;margin-right:10px;' 
              data-day-index='${i}' dayIndex='${i}' ><i class='fa fa-tv'></i></button>`;
      }

      if (inner == "True True") {

        colDate.headerTemplate += `<button title='ارسال ساعت کارکرد' id='${semlId}'
              class='btn btn-warning btn-xs forFound_wndSendWorkHour_OnInit' style='width:10px;height:15px;margin-right:10px;'
              data-day-index='${i}' dayIndex='${i}' ><b>↑</b></button>`;

      }

      colDate.hidden = false;
      colDate.width = 50;
      columns.push(colDate);
    }

    

    return columns;
  }

  function ktrlTimeSheets_DataBound(e) {

    var grid = this;
    var dataSource = grid.dataSource;
    //Loop through each record in a Kendo Grid
    $.each(grid.items(), function (index, item) {

      var tsRow = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($(item).closest("tr"));
      if (tsRow.title === "عملیات") {

        $.each(item.children, function (childIdx, childElm) {
          var emlId = 'SaveWorkHours' + childIdx;
          var semlId = 'SendWorkHours' + childIdx;
          var sendId = 'ShowSent' + childIdx;

          // var inner = childElm.innerText;
          // if (inner == "False False") {
          //   childElm.innerHTML = "<label title=' ' class='text-warning' ><i class='glyphicon glyphicon-ban-circle'></i> </label>"
          // }

          // if (inner == "True False" || inner == "True True") {

          //   childElm.innerHTML = `<button title='ثبت ساعت کارکرد' id='${emlId}' 
          //                 class='btn btn-success btn-xs forFound_kwndSaveWHs_OnInit' style='width:10px;height:15px'
          //                  dayIndex='${childIdx}' data-eml-id='${emlId}'>+</button>`;

          //   childElm.innerHTML += `<button title='نمایش کارکردهای این روز' id='${sendId}'  
          //     class='btn btn-info btn-xs forFound_ShowCurrentDaySendWorkHours' style='width:10px;height:15px;margin-right:10px;' 
          //       data-send-id='${sendId}' dayIndex='${childIdx}' ><i class='fa fa-tv'></i></button>`;
          // }

          // if (inner == "True True") {

          //   childElm.innerHTML += `<button title='ارسال ساعت کارکرد' id='${semlId}'
          //     class='btn btn-warning btn-xs forFound_wndSendWorkHour_OnInit' style='width:10px;height:15px;margin-right:10px;'
          //     data-seml-id='${semlId}' dayIndex='${childIdx}' ><b>↑</b></button>`;

          // }
        });
      }
    });

    // $('.forFound_kwndSaveWHs_OnInit').off().on('click', function () {
    //   var id = $(this).data("emlId");
    //   moduleData.createNewWorkHour.kwndSaveWHs_OnInit(id);
    // });

    // $('.forFound_ShowCurrentDaySendWorkHours').off().on('click', function () {
    //   var sendId = $(this).data("sendId");
    //   moduleData.history_sentWorkHour.ShowCurrentDaySendWorkHours(sendId);
    // });

    // $('.forFound_wndSendWorkHour_OnInit').off().on('click', function () {
    //   var semlId = $(this).data("semlId");
    //   moduleData.sendWorkHour.wndSendWorkHour_OnInit(semlId);
    // });


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


  //________________ جهت باز سازی TreeList اصلی



  function RefreshTimeSheet() {
    $.ajax({
      type: "Get",
      url: "/api/TimeSheetsAPI/GetTimeSheets",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: ktrlTimeSheets_OnRefresh,
      error: function (e) {

      }
    });
  }


  function ktrlTimeSheets_OnRefresh(response) {

    moduleData.data.timeSheetData_set(response);
    common_register.removeAndRecreateTreelisDiv();
    Init_TimeSheetTreeList();
    //$("#ktrlTimeSheets").data("kendoTreeList").dataSource.read();
    common.LoaderHide();
  }

  return {
    GetTimeSheets: GetTimeSheets,
    Init_TimeSheetTreeList: Init_TimeSheetTreeList,
    init: init
  };

})();




//________________

module.exports = {

  'GetTimeSheets': myMainGrid.GetTimeSheets,
  'Init_TimeSheetTreeList': myMainGrid.Init_TimeSheetTreeList,
  'init': myMainGrid.init

};
},{}],12:[function(require,module,exports){
// const common_register = require('./common');
// const common = require('../common/common');
// const data = require('./data');
// const mainGrid = require('./mainGrid');
// const monthlyGrid = require('./bottomPage_monthlyGrid');
// const sended_workouts = require('./history_sentWorkHour');
// const priodlyGrid = require('./bottomPage_priodlyGrid');
// const editWindow = require('./editWorkHour');

//_________صفحه بعد و قبل 
const period_next_pervious = (function(){

    const moduleData={};

    function init(common, common_register,  mainGrid,monthlyGrid, 
        history_sentWorkHour, priodlyGrid, editWindow, data) {

        moduleData.common_register = common_register;
        moduleData.common = common;
        moduleData.mainGrid = mainGrid;
        moduleData.monthlyGrid = monthlyGrid;
        moduleData.history_sentWorkHour = history_sentWorkHour;
        moduleData.priodlyGrid = priodlyGrid;
        moduleData.editWindow = editWindow;
        moduleData.data = data;

        $('#btnpreviousPeriod').off().on('click', function () {
            GetPreviousPeriod();
        });
    
        $('#btnSelectPeriod').off().on('click', function () {
            kwndSelectPeriod_OnInit();
        });
    
        $('#btnNextPeriod').off().on('click', function () {
            GetNextPeriod();
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
    
    function GetNextPeriod() {
        moduleData.common.LoaderShow();
    
        var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values[moduleData.data.timeSheetData_get()[0].values.length - 1]);
    
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetNextPeriod",
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
                moduleData.common.LoaderHide();
            },
            error: function (e) {
    
            }
        });
    }
    
    function GetPreviousPeriod() {
        moduleData.common.LoaderShow();
    
        var prmData = JSON.stringify(moduleData.data.timeSheetData_get()[0].values[0]);
    
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/GetPreviousPeriod",
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
    
                moduleData.common.LoaderHide();
    
            },
            error: function (e) {
    
            }
        });
    
    
    
    
    }
    
    function GetCurrentPeriod() {
        moduleData.common.LoaderShow();

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
                moduleData.common.LoaderHide();
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
            open: moduleData.common_register.adjustSize,
        }).data("kendoWindow").center().open();
    }
    
    function kwndSelectPeriod_OnClose() {
        $("#kwndSelectTimePeriod").data("kendoWindow").close()
    }
    
    /////----------------- دکمه تایید تعداد روزهای دوره که باید نشان بده 
    
    function btnSendPeriods_Onclick() {
        moduleData.common.LoaderShow();
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
                    moduleData.common.LoaderHide();
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
                    moduleData.common.LoaderHide();
                },
                error: function (e) {
    
                }
            });
        }
    
    }

    return {
        init:init,
        GetCurrentPeriod: GetCurrentPeriod
    };
})();




module.exports = {
    "init": period_next_pervious.init,
    "GetCurrentPeriod":  period_next_pervious.GetCurrentPeriod
}
},{}],13:[function(require,module,exports){
// const common_register = require('./common');
// const data = require('./data');

// ________________ارسال تایم شیت
const sendWorkHour = (function () {

	const moduleData={};

	function init(common_register, data) {
		moduleData.data = data;
		moduleData.common_register = common_register;
	}

	function wndSendWorkHour_OnClose() {
		$("#wndSendWorkHour").data("kendoWindow").close()
	}

	function GRDSendWorkHours_onInit(sendItem) {

		var ktrlTimeSheetsSend = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($("#" + sendItem).closest("tr"));
		moduleData.data.selDate_set(ktrlTimeSheetsSend.values[parseInt($("#" + sendItem).attr('dayindex')) - 3]);

		$("#SenddateTitle").text(moduleData.data.selDate_get().PersianDate);

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
						_presenceHour = response.Hours

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
						title: "ساعت کار ثبت شده    "
					},


					{
						title: "ارسال ",
						template: "<button   onclick='SendWorkHour_OnClick(this)' type='button' class='btn btn-success btn-sm' name='info' title='ارسال' > ارسال</button>",
						headerTemplate: "<label class='text-center'> ارسال </label>",
						filterable: false,
						sortable: false,
						width: 100
					},
					{
						title: "حذف ",
						template: "<button  onclick='DeleteWorkHourSendGrid(this)' type='button' class='btn btn-danger btn-sm' name='info' title='حذف' > حذف</button>",
						headerTemplate: "<label class='text-center'> حذف </label>",
						filterable: false,
						sortable: false,
						width: 100
					},
					]

				});
			},
			error: function (e) {

			}
		});
	}

	function wndSendWorkHour_OnInit(SendWHsIdx) {

		moduleData.data.sendItem_set(SendWHsIdx);
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
			open: moduleData.common_register.adjustSize,
		}).data("kendoWindow").center().open();

		GRDSendWorkHours_onInit(moduleData.data.sendItem_get());
	}

	function SendAllWorkHours_OnClick() {
		var ktrlTimeSheetsSend = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($("#" + moduleData.data.sendItem_get().id).closest("tr"));
		moduleData.data.selDate_set(ktrlTimeSheetsSend.values[parseInt($("#" + moduleData.data.sendItem_get().id).attr('dayindex')) - 3]);

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
						common.Notify(response[i], "success");
					} else {
						common.Notify(response[i], "danger");
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
			ID: dataItem.ID,
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
				common.Notify("انجام عملیات  ارسال با موفقیت به انجام رسید.", "success");
			},
			error: function (e) {

			}
		});

	}

	function DeleteWorkHourSendGrid(e) {
		var grid = $("#GRDSendWorkHours").data("kendoGrid");
		var dataItem = grid.dataItem($(e).closest("tr"));
		common.LoaderShow();
		var prmData = JSON.stringify(dataItem);
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/DeleteWorkHours",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: function (response) {
				Refresh_GRDSendWorkHour();
				RefreshTimeSheet();
				common.LoaderHide();
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

},{}]},{},[2]);
