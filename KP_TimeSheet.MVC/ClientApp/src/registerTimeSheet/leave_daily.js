const dl = (function () {

    const moduleData = {};
  
    function init(common, data, service) {
  
      moduleData.common = common;
      moduleData.data = data;
      moduleData.service = service;
  
      $('#btnNewDailyLeave').off().on('click', function () {
        private_openLeaveWindow();
      });
  
      $('#dailyLeave_btnCancel').off().on('click', function () {
        var w = $("#kwndDailyLeave").data("kendoWindow");
        if (w) w.close();
      });
  
  
    }
  
    function private_openLeaveWindow() {
  
      $("#dailyLeave_headerDiv").text("ثبت مرخصی روزانه");
  
      moduleData.service.getUserProjects((response) => {
        private_projectComboInit(response);
      });
  
      var kwndSendWHs = $("#kwndDailyLeave");
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
      }).data("kendoWindow").center().open();
  
  
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
        optionLabel: "انتخاب پروژه...",
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
  
    return {
      init: init
    };
  
  })();
  
  module.exports = {
    init: dl.init
  };