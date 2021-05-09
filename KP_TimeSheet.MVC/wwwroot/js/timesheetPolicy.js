(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const common = (function () {

	function version(){return "0.0.0.9";}

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
		//types:primary,secondary,success,danger,warning,info,light,dark"
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

	function getAvailabelSpace(id){
		console.log($( window ).height() - $("#"+id).position().top - 10);
		return $( window ).height() - $("#"+id).position().top - 10;
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

		getAvailabelSpace: getAvailabelSpace,

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

	getAvailabelSpace: common.getAvailabelSpace,

	version:common.version
};

},{}],2:[function(require,module,exports){

var newOtherPolicy = (function () {

    const moduleData = {};

    moduleData.currentItem = null;

    function init(common, service, refreshParentFn) {

        moduleData.common = common;
        moduleData.service = service;
        moduleData.refreshParentFn = refreshParentFn;

        $('#otherPolicy_btnCancel').off().on('click', function () {
            private_closeWindow();
        });

        $('#otherPolicy_btnSave').off().on('click', function () {
            save();
        });

    }

    function openNewOtherPolicyWindow() {

        $("#otherPolicy_headerDiv").text("ثبت قانون تایم شیت");
        moduleData.currentItem = null;

        moduleData.common.openWindow('WNDEditAndAddOtherPolicy', () => {
            private_setDatePickers();
            private_initSelectUserCombobox();
        }, () => reset());
    }

    function editPolicy(policy) {
        $("#otherPolicy_headerDiv").text("ویرایش قانون تایم شیت");

        moduleData.currentItem = policy;

        moduleData.common.openWindow('WNDEditAndAddOtherPolicy', () => {
            private_setDatePickers();
            private_initSelectUserCombobox();

            private_SetCurrentData(policy);

        }, () => reset());
    }

    function private_SetCurrentData(data) {

        $('#otherPolicy_dateValidicy').val(data.validity);
        $('#otherPolicy_dateStart').val(data.start);
        $('#otherPolicy_dateFinish').val(data.finish);


        $('#otherPolicy_checkIsOpen').prop('checked', data.isOpen == "true");
        $('#otherPolicy_checkMustHaveHozoor').prop('checked', data.userMustHasHozoor == "true");

        //user will set after get data from server
    }

    

    function private_closeWindow() {
        var w = $("#WNDEditAndAddOtherPolicy").data("kendoWindow");
        if (w) w.close();
        reset();
    }



    function private_initSelectUserCombobox() {
        $("#otherPolicy_selectUser").kendoDropDownList({
            dataSource: {
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: "/api/LoadCalendar/GetAllUsers",
                            success: function (result) {
                                // notify the data source that the request succeeded
                                options.success(result);
                                private_afterGetAllUserFromServer();
                            },

                        });
                    }

                },
                schema: {
                    model: {
                        id: "id"
                    }
                }
            },

            dataTextField: "fullName",
            dataValueField: "id",
            filter: "contains",
            optionLabel: "انتخاب کاربر...",

        });
    }

    function private_afterGetAllUserFromServer() {
        if (!moduleData.currentItem) return;

        var dropdownlist = $("#otherPolicy_selectUser").data("kendoDropDownList");
        dropdownlist.select(function (dataItem) {
            return dataItem.id == moduleData.currentItem.userId;
        });
    }


    function private_setDatePickers() {
        $('#otherPolicy_dateValidicy').daterangepicker({
            clearLabel: 'Clear',
            autoApply: true,
            opens: 'left',
            singleDatePicker: true,
            showDropdowns: true,
            jalaali: true,
            language: 'fa'
        }).on('apply.daterangepicker', function () {
            $('.tooltip').hide();
            $('.date-select').text($(this).val());
        });
        $('#otherPolicy_dateStart').daterangepicker({
            clearLabel: 'Clear',
            autoApply: true,
            opens: 'left',
            singleDatePicker: true,
            showDropdowns: true,
            jalaali: true,
            language: 'fa'
        }).on('apply.daterangepicker', function () {
            $('.tooltip').hide();
            $('.date-select').text($(this).val());
        });
        $('#otherPolicy_dateFinish').daterangepicker({
            clearLabel: 'Clear',
            autoApply: true,
            opens: 'left',
            singleDatePicker: true,
            showDropdowns: true,
            jalaali: true,
            language: 'fa'
        }).on('apply.daterangepicker', function () {
            $('.tooltip').hide();
            $('.date-select').text($(this).val());
        });
    }


    //----------------------
    function deletePolicy(policy) {
        
        moduleData.common.loaderShow();
        moduleData.service.deletePolicy(policy.id, () => {
            moduleData.common.loaderHide();
            moduleData.common.notify("حذف با موفقیت انجام شد", "success");
            private_closeWindow();

            moduleData.refreshParentFn();
        });

    }


    function savePolicyDeactivation(data, isDeactivated) {
        data.isDeactivated = isDeactivated ? "true" : "false";
        private_savePolicy(data, false);
    }
    function savePolicyIsOpen(data, isOpen) {
        data.isOpen = isOpen ? "true" : "false";
        private_savePolicy(data, false);
    }
    function savePolicyUserMustHasHozoor(data, userMustHasHozoor) {
        data.userMustHasHozoor = userMustHasHozoor ? "true" : "false";
        private_savePolicy(data, false);
    }


    function reset() {
        moduleData.currentItem = null;

        $('#otherPolicy_dateValidicy').val('');
        $('#otherPolicy_dateStart').val('');
        $('#otherPolicy_dateFinish').val('');

        $('#otherPolicy_checkIsOpen').prop('checked', true);
        $('#otherPolicy_checkMustHaveHozoor').prop('checked', true);

        var item = $("#otherPolicy_selectUser").data("kendoDropDownList");
        if (item && item.select) item.select(0);

        resetErrors();
    }
    function resetErrors() {
        //جایی که خطاها را نشان می دهد را پاک می کند
        $("span[for='otherPolicy_selectUser']").text("");
        $("span[for='otherPolicy_dateValidicy']").text("");
        $("span[for='otherPolicy_dateStart']").text("");
        $("span[for='otherPolicy_dateFinish']").text("");
    }

    function save() {

        resetErrors();

        if (!moduleData.currentItem) {
            moduleData.currentItem = { id: "00000000-0000-0000-0000-000000000000" };
        }

        var policy = {
            id: !moduleData.currentItem ? "00000000-0000-0000-0000-000000000000" : moduleData.currentItem.id,
            validity: $('#otherPolicy_dateValidicy').val(),
            start: $('#otherPolicy_dateStart').val(),
            finish: $("#otherPolicy_dateFinish").val(),
            userId: $("#otherPolicy_selectUser").data("kendoDropDownList").value(),
            isOpen: $('#otherPolicy_checkIsOpen').is(':checked'),
            userMustHasHozoor: $('#otherPolicy_checkMustHaveHozoor').is(':checked'),
        };

        if (private_checkUserInputData(policy)) return;


        private_sendSaveDataToServer(policy, moduleData.refreshParentFn);

    }

    function private_savePolicy(policy, wantRefresh) {
        var data = {
            id: policy.id,
            validity: policy.validity,
            start: policy.start,
            finish: policy.finish,
            userId: policy.userId,
            isOpen: policy.isOpen == "true",
            userMustHasHozoor: policy.userMustHasHozoor == "true",
            isDeactivated: policy.isDeactivated == "true"
        };

        private_sendSaveDataToServer(data, (wantRefresh ? moduleData.refreshParentFn : null));
    }

    function private_checkUserInputData(policy) {

        var hasError = false;

        if (!policy.userId) {
            hasError = true;
            $("span[for='otherPolicy_selectUser']").text("انتخاب کاربر ضروری است");
        }

        if (!policy.start) {
            hasError = true;
            $("span[for='otherPolicy_dateStart']").text("انتخاب تاریخ شروع ضروری است");
        }

        if (!policy.finish) {
            hasError = true;
            $("span[for='otherPolicy_dateFinish']").text("انتخاب تاریخ پایان ضروری است");
        }

        if (!policy.validity) {
            hasError = true;
            $("span[for='otherPolicy_dateValidicy']").text("انتخاب تاریخ اعتبار ضروری است");
        }

        return hasError;
    }

    function private_sendSaveDataToServer(data, afterSuccCallbackFn) {
        moduleData.common.loaderShow();
        moduleData.service.savePolicy(data, () => {
            moduleData.common.loaderHide();
            moduleData.common.notify("ثبت با موفقیت انجام شد", "success");
            private_closeWindow();

            if (afterSuccCallbackFn) afterSuccCallbackFn();
        });
    }


    return {
        init: init,
        openNewOtherPolicyWindow: openNewOtherPolicyWindow,
        editPolicy: editPolicy,
        deletePolicy: deletePolicy,
        savePolicyDeactivation: savePolicyDeactivation,
        savePolicyIsOpen: savePolicyIsOpen,
        savePolicyUserMustHasHozoor: savePolicyUserMustHasHozoor
    };

})();



module.exports = {
    init: newOtherPolicy.init,
    openNewOtherPolicyWindow: newOtherPolicy.openNewOtherPolicyWindow,
    editPolicy: newOtherPolicy.editPolicy,
    deletePolicy: newOtherPolicy.deletePolicy,
    savePolicyDeactivation: newOtherPolicy.savePolicyDeactivation,
    savePolicyIsOpen : newOtherPolicy.savePolicyIsOpen,
    savePolicyUserMustHasHozoor : newOtherPolicy.savePolicyUserMustHasHozoor
}
},{}],3:[function(require,module,exports){

var service = (function () {

    const moduleData = {};

    function init(common) {
        moduleData.common = common;
    }



    function savePolicy(policy, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/timesheetPlicy/SaveEditPolicy",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(policy),
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function deletePolicy(id, success_callBack, error_callBack) {
		$.ajax({
			type: "DELETE",
			url: "/api/timesheetPlicy/"+id,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function getDefualtConfigData(success_callBack, error_callBack) {
		$.ajax({
			type: "GET",
			url: "/api/timesheetPlicy/GetDefualtConfigData/",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function saveDefualtConfigData(defualtPolicy, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/timesheetPlicy/SaveDefualtConfigData",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(defualtPolicy),
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
        savePolicy: savePolicy,
		deletePolicy: deletePolicy,
		getDefualtConfigData: getDefualtConfigData,
		saveDefualtConfigData: saveDefualtConfigData
    };

})();



module.exports = {
    init: service.init,
    savePolicy : service.savePolicy,
	deletePolicy: service.deletePolicy,

	getDefualtConfigData: service.getDefualtConfigData,
	saveDefualtConfigData: service.saveDefualtConfigData
}
},{}],4:[function(require,module,exports){
const common = require('../common/common');
const newOtherPolicy = require('./newOtherPolicy');
const service = require('./service');

const mainPolicyGridId = "timesheetSystemDefualtPolicy_Grid";
const otherPolicyGridId = "timesheetOtherPolicy_Grid";
let selectedItemPolicy = null;
let dialog = null;

$("document").ready(function () {

  init();
  service.init(common);
  newOtherPolicy.init(common, service, refreshGrids);

});


function init() {
  dialog = $("#dialog");

  private_initTimeSheetMainConfig();

  private_intiTabs();
  private_initDefaultGrid();
  private_initOtherGrid();

  private_initConfirmDeleteDialog();
}

function private_initTimeSheetMainConfig() {

  service.getDefualtConfigData((conf)=>{
    if(!conf) return;

    $('#timesheetLockTime').daterangepicker({
      clearLabel: 'Clear',
      autoApply: true,
      opens: 'left',
      singleDatePicker: true,
      showDropdowns: true,
      jalaali: true,
      language: 'fa'
    }).on('apply.daterangepicker', function () {
      $('.tooltip').hide();
      $('.date-select').text($(this).val());
    });

    $("#timesheetLockTime").val(conf.timeSheetLockDate);
    $("#defualtOpenWeek").val(conf.defualtOpenTimeSheetWeeks);

  });

  $("#btnSaveDefualtConfig").off().on("click",()=>{
    var conf = {};
    conf.timeSheetLockDate = $("#timesheetLockTime").val();
    conf.defualtOpenTimeSheetWeeks = $("#defualtOpenWeek").val();

    if(!conf.timeSheetLockDate){
      alert("تاریخ قفل سیستم نمی تواند خالی باشد");
      return;
    }
    
    if(!conf.defualtOpenTimeSheetWeeks){
      alert("هفته پیش فرض نمی تواند خالی باشد");
      return;
    }


    service.saveDefualtConfigData(conf, ()=>{
      common.notify("ثبت تنظیمات پیش فرض با موفقیت انجام شد", "success");
    });



  });

}

function refreshGrids() {
  $("#" + mainPolicyGridId).data("kendoGrid").dataSource.read();
  $("#" + otherPolicyGridId).data("kendoGrid").dataSource.read();
}

function private_initConfirmDeleteDialog() {
  dialog.kendoDialog({
    title: false,
    closable: false,
    modal: false,
    content: "آیا از حذف این قانون اطمینان دارید؟",
    actions: [
      { text: 'بله', action: private_deleteSelectedPolicy },
      { text: 'خیر', primary: true }
    ],
  });
}

function private_intiTabs() {

  $("#tabstrip").kendoTabStrip({
    animation: {
      open: {
        effects: "fadeIn"
      }
    }
  });

  $("#tabstrip").show().css({ paddingTop: '40px', paddingRight: '10px', paddingLeft: '10px', height: '100%' });

}

function private_initDefaultGrid() {

  $("#" + mainPolicyGridId).kendoGrid({
    dataSource: {
      transport: {
        read: "/api/timesheetPlicy/" + common.version() + "/GetDefaultPoliciesList",
        cache: false
      },
      schema: {
        model: {
          fields: {
            id: { type: "string" },
            userTitle: { type: "string" },
            userId: { type: "string" },

            start: { type: "string" },
            finish: { type: "string" },
            validity: { type: "string" },

            isDeactivated: { type: "string" },
            isOpen: { type: "string" },
            userMustHasHozoor: { type: "string" },
          }
        }
      },
      pageSize: 20,
      serverPaging: false,
      serverFiltering: false,
      serverSorting: false
    },
    height: 550,
    filterable: true,
    sortable: true,
    pageable: false,
    columns: [
      {
        field: "isDeactivated",
        title: "غیر فعال",
        template: function (dataItem, b, c) {
          let answer = "<input type='checkbox' class='forFoundOnMainGrid_deactiveCheckbox'" + (dataItem.isDeactivated == "true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 60,
        filterable: false,
        sortable: false,
      },
      {
        field: "userTitle",
        title: "نام کاربر",
        filterable: true,
        sortable: true
      },
      {
        field: "validity",
        title: "تاریخ اعتبار",
        filterable: false,
        sortable: true
      },
      {
        field: "start",
        title: "تاریخ شروع",
        filterable: false,
        sortable: true
      },
      {
        field: "finish",
        title: "تاریخ پایان",
        filterable: false,
        sortable: true
      },

      {
        field: "isOpen",
        title: "باز است",
        template: function (dataItem, b, c) {
          let answer = "<input type='checkbox' class='forFoundOnMainGrid_isOpenCheckbox'" + (dataItem.isOpen == "true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 60,
        filterable: false,
        sortable: false,
      },
      {
        field: "userMustHasHozoor",
        title: "نیاز به حضور",
        template: function (dataItem, b, c) {
          let answer = "<input type='checkbox' class='forFoundOnMainGrid_userMustHasHozoorCheckbox'" + (dataItem.userMustHasHozoor == "true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 80,
        filterable: false,
        sortable: false,
      },

    ],
    dataBound: private_gridMainPolicyDataBound
  });
}

function private_initOtherGrid() {

  $("#" + otherPolicyGridId).kendoGrid({
    dataSource: {
      transport: {
        read: "/api/timesheetPlicy/" + common.version() + "/GetOtherPoliciesList",
        cache: false
      },
      schema: {
        model: {
          fields: {
            id: { type: "string" },
            userTitle: { type: "string" },
            userId: { type: "string" },

            start: { type: "string" },
            finish: { type: "string" },
            validity: { type: "string" },

            isDeactivated: { type: "string" },
            isOpen: { type: "string" },
            userMustHasHozoor: { type: "string" },
          }
        }
      },
      pageSize: 20,
      serverPaging: false,
      serverFiltering: false,
      serverSorting: false
    },
    toolbar: "<a class='btn btn-info' id='btnAddNewPolicy' >افزودن قانون جدید</a> ",
    height: 550,
    filterable: true,
    sortable: true,
    pageable: false,
    columns: [
      {
        field: "isDeactivated",
        title: "غیر فعال",
        template: function (dataItem, b, c) {
          let answer = "<input type='checkbox' class='forFound_deactiveCheckbox'" + (dataItem.isDeactivated == "true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 60,
        filterable: false,
        sortable: false,
        editable: () => false
      },
      {
        field: "userTitle",
        title: "نام کاربر",
        filterable: true,
        sortable: true
      },
      {
        field: "validity",
        title: "تاریخ اعتبار",
        filterable: false,
        sortable: true
      },
      {
        field: "start",
        title: "تاریخ شروع",
        filterable: false,
        sortable: true
      },
      {
        field: "finish",
        title: "تاریخ پایان",
        filterable: false,
        sortable: true
      },

      {
        field: "isOpen",
        title: "باز است",
        template: function (dataItem, b, c) {
          let answer = "<input type='checkbox' class='forFound_isOpenCheckbox'" + (dataItem.isOpen == "true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 60,
        filterable: false,
        sortable: false,
      },
      {
        field: "userMustHasHozoor",
        title: "نیاز به حضور",
        template: function (dataItem, b, c) {
          let answer = "<input type='checkbox' class='forFound_userMustHasHozoorCheckbox'" + (dataItem.userMustHasHozoor == "true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 90,
        filterable: false,
        sortable: false,
      },
      {
        title: "عملیات",
        width: 140,
        template: function (dataItem, b, c) {
          let answer = "<button type='button' style='margin-right:2px;' class='btn btn-success btn-sm forFound_EditPolicy'>ویرایش</button>";
          answer += "<button type='button' style='margin-right:2px;' class='btn btn-danger btn-sm forFound_DeletePolicy'>حذف</button>";
          return answer;
        }
      },
      // {
      //     field: "OrderDate",
      //     title: "Order Date",
      //     format: "{0:MM/dd/yyyy}"
      // }, {
      //     field: "ShipName",
      //     title: "Ship Name"
      // }, {
      //     field: "ShipCity",
      //     title: "Ship City"
      // }
    ],
    dataBound: private_gridOtherPolicyDataBound
  });

}

function private_gridMainPolicyDataBound() {

  $('.forFoundOnMainGrid_deactiveCheckbox').off().on('change', function () {
    var grid = $("#" + mainPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;

    newOtherPolicy.savePolicyDeactivation(dataItem, this.checked);
  });

  $('.forFoundOnMainGrid_isOpenCheckbox').off().on('change', function () {
    var grid = $("#" + mainPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;

    newOtherPolicy.savePolicyIsOpen(dataItem, this.checked);
  });

  $('.forFoundOnMainGrid_userMustHasHozoorCheckbox').off().on('change', function () {
    var grid = $("#" + mainPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;

    newOtherPolicy.savePolicyUserMustHasHozoor(dataItem, this.checked);
  });
}

function private_gridOtherPolicyDataBound() {
  $('#btnAddNewPolicy').off().on('click', () => newOtherPolicy.openNewOtherPolicyWindow());

  $('.forFound_EditPolicy').off().on('click', function () {
    var grid = $("#" + otherPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    newOtherPolicy.editPolicy(dataItem);
  });

  $('.forFound_DeletePolicy').off().on('click', function () {
    var grid = $("#" + otherPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;
    dialog.data("kendoDialog").open();
  });

  $('.forFound_deactiveCheckbox').off().on('change', function () {
    var grid = $("#" + otherPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;

    newOtherPolicy.savePolicyDeactivation(dataItem, this.checked);
  });

  $('.forFound_isOpenCheckbox').off().on('change', function () {
    var grid = $("#" + otherPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;

    newOtherPolicy.savePolicyIsOpen(dataItem, this.checked);
  });

  $('.forFound_userMustHasHozoorCheckbox').off().on('change', function () {
    var grid = $("#" + otherPolicyGridId).data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    selectedItemPolicy = dataItem;

    newOtherPolicy.savePolicyUserMustHasHozoor(dataItem, this.checked);
  });
}

function private_deleteSelectedPolicy() {
  newOtherPolicy.deletePolicy(selectedItemPolicy);
}



},{"../common/common":1,"./newOtherPolicy":2,"./service":3}]},{},[4]);
