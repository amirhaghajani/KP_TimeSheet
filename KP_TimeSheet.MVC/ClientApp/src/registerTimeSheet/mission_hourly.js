const hm = (function () {

  const moduleData = {};

  function init(common, data, service) {

    moduleData.common = common;
    moduleData.data = data;
    moduleData.service = service;

    $('#btnNewHourlyMission').off().on('click', function () {
      private_openMissionWindow();
    });

    $('#mission_btnCancel').off().on('click', function () {
      var w = $("#kwndHourlyMission").data("kendoWindow");
      if (w) w.close();
      reset();
    });
    $('#mission_btnSave').off().on('click', function () {
      save();
    });


  }

  function private_openMissionWindow() {

    $("#mission_headerDiv").text("ثبت ماموریت ساعتی");

    moduleData.service.getUserProjects((response) => {
      private_projectComboInit(response);
    });

    var kwndSendWHs = $("#kwndHourlyMission");
    kwndSendWHs.kendoWindow({
      width: moduleData.common.window_width(),
      height: moduleData.common.window_height(),

      activate: function () {
        moduleData.common.addNoScrollToBody();
        private_setDatepicker();
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
    
    debugger;

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

		});
	}

  return {
    init: init
  };

})();

module.exports = {
  init: hm.init
};