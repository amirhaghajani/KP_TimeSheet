(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const common = (function () {

	function version(){return "0.0.0.10";}

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
const common = require('../common/common');

var _OrganUnits = [];
var OrganUnit = {};
var _UsersOrganUnits = [];
var _UnitUsers = [];
var SelectedUser = {};
var SelectedManager = {};


$("document").ready(function () {
    BuildNewOrganUnit();

    init();

});



function init() {
    $("#UnitTitle").keyup(function () {
        OrganUnit.title = $("#UnitTitle").val();
    });

    $("#btnAddNewUserToUnit").off().on('click', function () { AddNewUserToUnit(); });
    $("#btnApprove").off().on('click', function () { SendOrganUnit(); });
    $("#btnCancel").off().on('click', function () { WNDEditAndAddOrgan_OnClose(); });

}

function BuildNewOrganUnit() {

    $.ajax({
        type: "Get",
        url: "/api/SettingApi/BuildNewOrganUnit",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            OrganUnit = response;

            GetOrganUnits();
            GetUsersOrganUnits();
            GRDOrganUsers_OnInit();


        },
        error: function (e) {
        }
    });
}

function GetUsersOrganUnits() {
    $.ajax({
        type: "Get",
        url: "/api/LoadCalendar/GetAllUsers",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            _UsersOrganUnits = response

            DDLUnitManager_OnInit();
            DDLtParentOrgan_OnInit();
            DDLAddUser_OnInit();
        },
        error: function (e) {

        }
    });
}

function RefreshGRDOrganUnits() {
    $.ajax({
        type: "Get",
        url: "/api/SettingApi/GetAllOrganisationUnits",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            _OrganUnits = response;
            $("#GRDOrganisationUnits").data("kendoGrid").dataSource.read();
        },
        error: function (e) {
        }
    });
}

function GetOrganUnits() {
    $.ajax({
        type: "Get",
        url: "/api/SettingApi/GetAllOrganisationUnits",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnGetOrganUnits,
        error: function (e) {
        }
    });
}

function OnGetOrganUnits(response) {
    _OrganUnits = response;
    GRDOrganisationUnits_OnInit();
    DDLtParentOrgan_OnInit();
}

function WNDEditAndAddOrgan_OnOpen() {
    common.openWindow('WNDEditAndAddOrgan');
}

function WNDEditAndAddOrgan_OnClose() {
    $("#WNDEditAndAddOrgan").data("kendoWindow").close();
}

function GRDOrganisationUnits_OnInit() {

    $("#GRDOrganisationUnits").kendoGrid({
        dataSource: {
            transport: {
                read: function (e) {
                    e.success(_OrganUnits);
                }
            },
            schema: {

                model: {
                    id: "id"
                },
                total: function (response) {
                    return response.length;
                }
            }
        },
        height: 600,
        toolbar: "<a class='btn btn-info' id='btnAddNewUnit' >افزودن واحد جدید</a> ",
        filterable: true,
        sortable: true,
        selectable: true,
        columns: [
            { field: "title", title: "عنوان", width: 50 },
            { field: "managerFullName", title: "مدیر", width: 50 },

            {
                title: "عملیات",
                template: "<button type='button' class='btn btn-info btn-sm edit forFoundBtnEdit'  title='ویرایش' name='info'>ویرایش</button>" + 
                "<button type='button' class='btn btn-warning btn-sm edit forFoundBtnDelete' title='حذف' name='info' style='margin-right:5px' > حذف</button>",
                headerTemplate: "<label class='text-center'> عملیات </label>",
                filterable: false,
                sortable: false,
                width: 30
            }
        ],
        pageable: {
            pageSize: 15,
            pageSizes: true
        },
        dataBound: dataBoundOrganisationUnits
    });
}

function dataBoundOrganisationUnits() {
    $("#btnAddNewUnit").off().on('click', function () { AddNewUnit(); });
    $(".forFoundBtnEdit").off().on('click', function () { EditOrganUnit(this); });
    $(".forFoundBtnDelete").off().on('click', function () { DeleteOrganUnit(this); });
}

function AddNewUnit() {

    $("#DDLtUnitManager").data("kendoDropDownList").select(0);
    $("#DDLAddUser").data("kendoDropDownList").select(0);
    $("#DDLtParentOrgan").data("kendoDropDownList").select(0);


    $.ajax({
        type: "Get",
        url: "/api/SettingApi/BuildNewOrganUnit",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            OrganUnit = response;
            WNDEditAndAddOrgan_OnOpen();
            FillFormAddUnit();

        },
        error: function (e) {
        }
    });


}

function DDLtParentOrgan_OnInit() {

    $("#DDLtParentOrgan").kendoDropDownList({
        dataSource: {
            data: _OrganUnits,
            schema: {
                model: {
                    id: "id"
                }
            }
        },

        dataTextField: "title",
        dataValueField: "id",
        filter: "contains",
        optionLabel: "انتخاب بخش...",
        change: SelectUnitParent
    });
    common.loaderHide();

}

function DDLUnitManager_OnInit() {
    $("#DDLtUnitManager").kendoDropDownList({
        dataSource: {
            data: _UsersOrganUnits,
            schema: {
                model: {
                    id: "id"
                }
            }
        },

        dataTextField: "fullName",
        dataValueField: "id",
        filter: "contains",
        optionLabel: "انتخاب مدیر...",
        change: SelectUnitManager
    });
}

function DDLAddUser_OnInit() {
    $("#DDLAddUser").kendoDropDownList({
        dataSource: {
            data: _UsersOrganUnits,
            schema: {
                model: {
                    id: "id"
                }
            }
        },

        dataTextField: "fullName",
        dataValueField: "id",
        filter: "contains",
        optionLabel: "انتخاب فرد...",
        change: SelectAddUser
    });
}

function SelectUnitParent() {
    OrganUnit.parentId = $("#DDLtParentOrgan").data("kendoDropDownList").value();
}

function SelectUnitManager() {
    SelectedManager = FindUserById($("#DDLtUnitManager").data("kendoDropDownList").value())
    OrganUnit.managerID = SelectedManager.id;
}

function SelectAddUser() {

    id = $("#DDLAddUser").data("kendoDropDownList").value();
    SelectedUser = FindUserById(id);


}

function IsExistInList(entities, id) {
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].id == id) {
            return true;
        }
    }
    return false;
}

function FindUserById(id) {

    var result = {};
    for (var i = 0; i < _UsersOrganUnits.length; i++) {
        if (_UsersOrganUnits[i].id == id) {
            result = _UsersOrganUnits[i];
        }
    }
    return result;
}

function EditOrganUnit(e) {
    var grid = $("#GRDOrganisationUnits").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));

    OrganUnit = dataItem;
    FillFormEditUnit();
    WNDEditAndAddOrgan_OnOpen();

}

function DeleteOrganUnit(e){
    var grid = $("#GRDOrganisationUnits").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));

    $("#DeleteDialog").kendoDialog({
        visible: true,
        width: "450px",
        title: "حذف تقویم انتخاب شده",
        closable: true,
        modal: true,
        content: "<p>آیا از خذف  <strong>" + dataItem.title + "</strong> اطمینان دارید?<p>",
        actions: [
            { text: 'بله', action: function () { DeleteOrganUnit_Implement(dataItem.id) } },
            { text: 'خیر', action: function () { } },
        ],
        close: function () {

        }
    });

    
}
function DeleteOrganUnit_Implement(organId){
    $.ajax({
        type: "Delete",
        url: "/api/SettingApi/"+organId,
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            
            common.notify("واحد سازمانی حذف گردید", "success");
            RefreshGRDOrganUnits();

        },
        error: function (e) {

        }
    });
}

function AddNewUserToUnit(e) {

    if(!SelectedUser.id){
        common.notify("کاربر انتخاب نشده است", "danger");
        return;
    }

    if (IsExistInList(OrganUnit.users, SelectedUser.id)) {
        common.notify("کاربر در این واحد میباشد", "danger");
    } else {
        OrganUnit.users.push(SelectedUser);
        $("#GRDOrganUsers").data("kendoGrid").dataSource.read();
        common.notify("کاربر به واحد مربوطه افزوده شد", "success");
    }

}

function GRDOrganUsers_OnInit() {
    $("#GRDOrganUsers").kendoGrid({
        dataSource: {
            transport: {
                read: function (e) {
                    e.success(OrganUnit.users);
                }
            },
            schema: {
                model: {
                    id: "id"
                },

            }
        },
        height: 300,
        filterable: true,
        sortable: true,
        selectable: true,
        columns: [
            { field: "fullName", title: "نام فرد", width: 50 },
            {
                title: "حذف",
                template: "<button class='btn btn-warning btn-sm edit forFoundDeleteFromUsers' name='info' title='حذف' > حذف</button>",
                headerTemplate: "<label class='text-center'> حذف </label>",
                filterable: false,
                sortable: false,
                width: 30
            }
        ],
        pageable: {
            pageSize: 5,
            pageSizes: false
        },
        dataBound: dataBoundOrganUsers
    });
}

function dataBoundOrganUsers() {
    $(".forFoundDeleteFromUsers").off().on('click', function () { DeleteFromUsers(this); });
}

function FillFormAddUnit() {
    $("#UnitTitle").val(OrganUnit.title);
    GRDOrganUsers_OnInit();
}

function FillFormEditUnit() {

    $("#UnitTitle").val(OrganUnit.title);
    GRDOrganUsers_OnInit();

    var DDLtUnitManager = $("#DDLtUnitManager").data("kendoDropDownList");
    var DDLtParentOrgan = $("#DDLtParentOrgan").data("kendoDropDownList");

    for (var i = 0; i < _UsersOrganUnits.length; i++) {
        if (_UsersOrganUnits[i].id == OrganUnit.managerID) {
            DDLtUnitManager.select(i + 1);
            OrganUnit.managerID = _UsersOrganUnits[i].id;
            return
        }
    }

    for (var i = 0; i < _OrganUnits.length; i++) {
        if (_OrganUnits[i].id == OrganUnit.id) {
            DDLtParentOrgan.select(i + 1);
            OrganUnit.parentId = _OrganUnits[i].id;
            return
        }
    }

    $("#GRDOrganUsers").data("kendoGrid").dataSource.read();
}

function SendOrganUnit() {

    var prmData = JSON.stringify(OrganUnit);
    $.ajax({
        type: "Post",
        url: "/api/SettingApi/SaveOrganisationUnit",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            WNDEditAndAddOrgan_OnClose();
            RefreshGRDOrganUnits();


        },
        error: function (e) {

        }
    });
}

function DeleteFromUsers(e) {
    ;
    var grid = $("#GRDOrganUsers").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));

    for (var i = 0; i < OrganUnit.users.length; i++) {
        if (dataItem.id == OrganUnit.users[i].id) {
            OrganUnit.users.splice(i, 1);
        }
        $("#GRDOrganUsers").data("kendoGrid").dataSource.read();


    }
}

},{"../common/common":1}]},{},[2]);
