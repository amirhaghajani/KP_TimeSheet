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

    // moduleData.service.getUserProjects((response) => {
    //   private_projectComboInit(response);
    // });

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


    // var item = $("#leave_selectProject").data("kendoDropDownList");
    // if (item && item.select) item.select(0);

    resetErrors();
  }
  function resetErrors() {
    //جایی که خطاها را نشان می دهد را پاک می کند
    $("span[for='leave_date']").text("");
    $("span[for='leave_hourStart']").text("");
    $("span[for='leave_hourFinish']").text("");
  }

  function save() {

    moduleData.common.loaderShow();

    resetErrors();

    var mission = {
      id: "00000000-0000-0000-0000-000000000000",
      persianLeaveDate: $('#leave_date').val(),
      persianTimeFrom: $('#leave_hourStart').val(),
      persianTimeTo: $('#leave_hourFinish').val(),
      //projectID: $("#leave_selectProject").data("kendoDropDownList").value(),
    };


    if (!mission.persianLeaveDate.length) {
      moduleData.common.loaderHide();
      $("span[for='leave_date']").text("تاریخ ضروری است");
      return;
    }
    if (!mission.persianTimeFrom.length) {
      moduleData.common.loaderHide();
      $("span[for='leave_hourStart']").text("ساعت شروع ضروری است");
      return;
    }
    if (!mission.persianTimeTo.length) {
      moduleData.common.loaderHide();
      $("span[for='leave_hourFinish']").text("ساعت پایان ضروری است");
      return;
    }

    

    //if (!mission.projectID.length) mission.projectID = "00000000-0000-0000-0000-000000000000";

    moduleData.service.saveHourlyLeave(mission, () => {

      moduleData.period_next_pervious.GetCurrentPeriod();
			private_closeWindow();
      moduleData.common.loaderHide();
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