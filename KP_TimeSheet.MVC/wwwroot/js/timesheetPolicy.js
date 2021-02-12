(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const common = (function () {

	function version(){return "0.0.0.7";}

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

var service = (function () {

    const moduleData = {};

    moduleData.currentItem = null;

    function init(common) {

        moduleData.common = common;

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

    function deletePolicy(policy) {
        alert(JSON.stringify(policy));
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
        if(!moduleData.currentItem) return;
        
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

        var policy = {
            id: "00000000-0000-0000-0000-000000000000",
            validity: $('#otherPolicy_dateValidicy').val(),
            start: $('#otherPolicy_dateStart').val(),
            finish: $("#otherPolicy_dateFinish").val(),
            userId: $("#otherPolicy_selectUser").data("kendoDropDownList").value(),
            isOpen: $('#otherPolicy_checkIsOpen').is(':checked'),
            mustHaveHozoor: $('#otherPolicy_checkMustHaveHozoor').is(':checked'),
        };

        alert(JSON.stringify(policy));

    }


    return {
        init: init,
        openNewOtherPolicyWindow: openNewOtherPolicyWindow,
        editPolicy: editPolicy,
        deletePolicy: deletePolicy
    };

})();



module.exports = {
    init: service.init,
    openNewOtherPolicyWindow: service.openNewOtherPolicyWindow,
    editPolicy: service.editPolicy,
    deletePolicy: service.deletePolicy
}
},{}],3:[function(require,module,exports){
const common = require('../common/common');
const newOtherPolicy = require('./newOtherPolicy');

const otherPolicyGridId = "timesheetOtherPolicy_Grid";
let selectedItemPolicy = null;
let dialog = null;

$("document").ready(function () {

  init();
  newOtherPolicy.init(common);

});


function init() {
  dialog = $("#dialog");

  private_intiTabs();
  private_initDefaultGrid();
  private_initOtherGrid();

  private_initConfirmDeleteDialog();
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

  $("#tabstrip").show().css({ paddingTop: '10px', paddingRight: '10px', paddingLeft: '10px', height: '100%' });

}

function private_initDefaultGrid() {

  $("#timesheetSystemDefualtPolicy_Grid").kendoGrid({
    dataSource: {
      transport: {
        read: "/api/timesheetPlicy/" + common.version() + "/GetDefaultPoliciesList"
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
          let answer = "<input type='checkbox' class='forFound_approveCheckbox'" + (dataItem.isDeactivated=="true" ? "checked" : "") + "/>";
          return answer;
        },
        width: 60,
        filterable: false,
        sortable: false,
        editable: () => false
      },
      
      "userTitle",
      "start",
      "finish"
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
    ]
  });
}

function private_initOtherGrid() {

  $("#" + otherPolicyGridId).kendoGrid({
    dataSource: {
      transport: {
        read: "/api/timesheetPlicy/" + common.version() + "/GetOtherPoliciesList",
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
    columns: [{
      field: "isDeactivated",
      title: "غیر فعال",
      template: function (dataItem, b, c) {
        let answer = "<input type='checkbox' class='forFound_approveCheckbox'" + (dataItem.isDeactivated=="true" ? "checked" : "") + "/>";
        return answer;
      },
      width: 60,
      filterable: false,
      sortable: false,
      editable: () => false
    },
      "userTitle",
      "start",
      "finish",
    {
      title: "عملیات",
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
}

function private_deleteSelectedPolicy() {
  newOtherPolicy.deletePolicy(selectedItemPolicy);
}



},{"../common/common":1,"./newOtherPolicy":2}]},{},[3]);
