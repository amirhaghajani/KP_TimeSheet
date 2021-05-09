// const common = require('../common/common');
// const common_register = require('./common');
// const data = require('./data');
// const period_next_pervious = require('./period_next_pervious');
// const mainGrid = require('./mainGrid');


//_____________________پنجره ذخیره
const module_createNewRorkHour = (function () {

    const moduleData = {};

    function init(common, common_register, period_next_pervious, data, service, common_timeSheet) {
        moduleData.common = common;
        moduleData.common_register = common_register;
        moduleData.period_next_pervious = period_next_pervious;
        moduleData.data = data;
        moduleData.service = service;
        moduleData.common_timeSheet = common_timeSheet;

        moduleData.afterGetTasksEnd = null;

        moduleData.currentWorkoutId = null;

        $('#btnDeleteCurrentWorkhour').hide();

        $('#btnCancel_kwndSaveWHs').off().on('click', function () {
            kwndSaveWHs_OnClose();
        });
        $('#btnSaveWorkHours_kwndSaveWHs').off().on('click', function () {
            btnSaveWorkHours_Onclick();
        });

        $('#btnDeleteCurrentWorkhour').off().on('click', function () {
            if (!moduleData.currentWorkoutId) return;

            moduleData.common.loaderShow();

            moduleData.service.deleteWorkHour(moduleData.currentWorkoutId, () => {

                moduleData.period_next_pervious.GetCurrentPeriod();
                kwndSaveWHs_OnClose();
                moduleData.common.loaderHide();
            });
        });

    }

    function kwndSaveWHs_OnInit_ForEdit(dayTime, projectId, taskId_nullable, time_nullable, workoutId, description) {

        $('#btnDeleteCurrentWorkhour').hide();
        if (workoutId) $('#btnDeleteCurrentWorkhour').show();

        moduleData.currentWorkoutId = workoutId;
        moduleData.afterGetTasksEnd = null;
        var timeSheetData = moduleData.data.timeSheetData_get();
        

        $('#registerWindo_headerDiv').text(dayTime.persianDay + " " + dayTime.persianDate);

        moduleData.data.selDate_set(dayTime);

        moduleData.whenGetProjectsTasksEnd = () => {

        }

        if (taskId_nullable) {
            moduleData.afterGetProjectsEnd = () => {
                var dropdownlist = $("#ddlTasks").data("kendoDropDownList");
                dropdownlist.select(function (dataItem) {
                    return dataItem.id == taskId_nullable;
                });
            }
        }

        GetProjects(() => {
            var dropdownlist = $("#ddlProjects").data("kendoDropDownList");
            dropdownlist.select(function (dataItem) {
                return dataItem.id == projectId;
            });
            GetTasks();
        });

        if (time_nullable) $("#ktpWorkHour").val(time_nullable);

        $("#txtDescription").val(description);

    }

    function kwndSaveWHs_OnInit(dayIndex) {
        $('#btnDeleteCurrentWorkhour').hide();
        moduleData.currentWorkoutId = null;
        moduleData.afterGetTasksEnd = null;

        var timeSheetData = moduleData.data.timeSheetData_get();
        var item = timeSheetData[0].values[dayIndex];

        $('#registerWindo_headerDiv').text(item.persianDay + " " + item.persianDate);

        moduleData.data.selDate_set(item);

        GetProjects();
    }

    function kwndSaveWHs_OnClose() {
        var w = $("#kwndSaveWorkHours").data("kendoWindow");
        ResetSaveWindow();
        if (w) w.close();
    }

    function GetProjects(afterGetProjectsEnd) {

        moduleData.service.getUserProjects((response)=>{
            ddlProjects_OnInit(response);
            if (afterGetProjectsEnd) afterGetProjectsEnd();
        });
        
    }

    function ddlProjects_OnInit(response) {

        if (response.length == 0) {
            moduleData.common.notify("کاربر گرامی شما فاقد پروژه میباشید", "danger");
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

            moduleData.common.openWindow('kwndSaveWorkHours');
            
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
            success: (response) => {

                ddlTasks_OnInit(response);
                if (moduleData.afterGetProjectsEnd) moduleData.afterGetProjectsEnd();

            },
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

        $("span[for='ktpWorkHour']").text(""); //جایی که خطاها را نشان می دهد را پاک میک می کند
        $("span[for='ddlTasks']").text("");

        var workHourJson = {
            ID: moduleData.currentWorkoutId,
            Date: moduleData.data.selDate_get().date,
            EmployeeID: null,
            TaskID: $("#ddlTasks").data("kendoDropDownList").value(),
            Minutes: moduleData.common_timeSheet.convertClockTextToMinute($("#ktpWorkHour").data("kendoTimePicker")._oldText),
            ProjectID: $("#ddlProjects").data("kendoDropDownList").value(),
            Description: $("#txtDescription").val()
        };

        if (!workHourJson.TaskID) {
            $("span[for='ddlTasks']").text("وظیفه ضروری است");
            return;
        }

        if (!workHourJson.Minutes) {
            $("#ktpWorkHour").val("");
            $("span[for='ktpWorkHour']").text("ساعت ضروری است");
            return;
        }


        moduleData.common.loaderShow();

        kwndSaveWHs_OnClose();
        var prmData = JSON.stringify(workHourJson);

        moduleData.service.saveWorkHours(prmData, SaveWorkHours_OnSuccess);
    }

    function SaveWorkHours_OnSuccess(response) {

        moduleData.period_next_pervious.GetCurrentPeriod();
        kwndSaveWHs_OnClose();
        if (response.lenth > 0) {
            for (var i = 0; i < response.length; i++) {
                moduleData.common.notify(response[i], "danger");
            }
        }
        else {
            moduleData.common.notify("ثبت کاکرد با موفقیت انجام شد", "success");
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

        moduleData.afterGetProjectsEnd=null;
    }

    return {
        kwndSaveWHs_OnInit: kwndSaveWHs_OnInit,
        kwndSaveWHs_OnInit_ForEdit: kwndSaveWHs_OnInit_ForEdit,
        init: init
    };

})();




module.exports = {

    'kwndSaveWHs_OnInit': module_createNewRorkHour.kwndSaveWHs_OnInit,
    kwndSaveWHs_OnInit_ForEdit: module_createNewRorkHour.kwndSaveWHs_OnInit_ForEdit,
    'init': module_createNewRorkHour.init
}