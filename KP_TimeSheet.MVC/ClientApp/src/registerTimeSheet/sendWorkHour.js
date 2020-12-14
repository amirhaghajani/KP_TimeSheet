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
