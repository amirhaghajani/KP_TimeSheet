
var service = (function () {

  const moduleData = {};

  function init(data, common_timeSheet, common) {
    moduleData.data = data;
    moduleData.common_timeSheet = common_timeSheet;
    moduleData.common = common;
  }


  //اون اول اطلاعات کل تایم شیت ها را می دهد
  function getTimeSheets(fromDate, toDate, success_callBack, error_callBack) {

    let url = "/api/Confirm/" + moduleData.common.version() + "/employee";

    if (fromDate) {
      url = `/api/Confirm/${moduleData.common.version()}/employeeTimeSheet/${fromDate}/${toDate}`;
    }

    $.ajax({
      type: "Get",
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",

      success: function (response) {

        moduleData.data.timeSheetData_beforProcess_set(response);

        var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForEmployee(response);

        moduleData.data.timeSheetData_set(data);
        if (success_callBack) success_callBack(data);
      },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }

  function getNextTimeSheets(type, date, success_callBack, error_callBack) {

    $.ajax({
      type: "Get",
      url: `/api/Confirm/${moduleData.common.version()}/employee/${type}/${date}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",

      success: function (response) {

        var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForEmployee(response);

        moduleData.data.timeSheetData_set(data);
        if (success_callBack) success_callBack(data);
      },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }


  function saveWorkHours(prmData, success_callBack, error_callBack) {
    $.ajax({
      type: "Post",
      url: "/api/TimeSheetsAPI/SaveWorkHours",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: prmData,
      success: success_callBack ? (response) => success_callBack(response) : () => { },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }

  function deleteWorkHour(workHourId, success_callBack, error_callBack) {
    $.ajax({
      type: "Post",
      url: "/api/TimeSheetsAPI/DeleteWorkHours",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({ id: workHourId }),
      success: success_callBack ? (response) => success_callBack(response) : () => { },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }


  function getUserProjects(success_callBack, error_callBack) {
    $.ajax({
      type: "Get",
      url: "/api/ProjectsAPI/GetProjects",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response) {
        moduleData.data.userProjects_set(response);
        if (success_callBack) success_callBack(response);
      },
      error: (error) => {
        moduleData.common.loaderHide();
        moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
        if (error_callBack) error_callBack();
      }
    });
  }

  return {
    init: init,

    getTimeSheets: getTimeSheets,
    saveWorkHours: saveWorkHours,
    deleteWorkHour: deleteWorkHour,

    getNextTimeSheets: getNextTimeSheets,

    getUserProjects: getUserProjects
  };

})();



module.exports = {
  init: service.init,

  getTimeSheets: service.getTimeSheets,
  saveWorkHours: service.saveWorkHours,
  deleteWorkHour: service.deleteWorkHour,

  getNextTimeSheets: service.getNextTimeSheets,

  getUserProjects:service.getUserProjects
}