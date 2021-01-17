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

		var kwndSendWHs = $("#kwndDailyLeave");
		kwndSendWHs.kendoWindow({
			width: moduleData.common.window_width(),
			height: moduleData.common.window_height(),

			activate: function () {
				moduleData.common.addNoScrollToBody();

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

			},
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
			close: reset
		}).data("kendoWindow").center().open();


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