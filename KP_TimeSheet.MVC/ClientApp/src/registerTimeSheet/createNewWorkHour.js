// const common = require('../common/common');
// const common_register = require('./common');
// const data = require('./data');
// const period_next_pervious = require('./period_next_pervious');
// const mainGrid = require('./mainGrid');


//_____________________پنجره ذخیره
const module_createNewRorkHour =(function(){

    const moduleData={};

    function init(common,common_register,period_next_pervious,data, service){
        moduleData.common = common;
        moduleData.common_register = common_register;
        moduleData.period_next_pervious = period_next_pervious;
        moduleData.data = data;
        moduleData.service = service;

        $('#btnCancel_kwndSaveWHs').off().on('click',function(){
            kwndSaveWHs_OnClose();
        });
        $('#btnSaveWorkHours_kwndSaveWHs').off().on('click',function(){
            btnSaveWorkHours_Onclick();
        });
    }
    
    function kwndSaveWHs_OnInit(dayIndex) {
    
        var timeSheetData = moduleData.data.timeSheetData_get();
        moduleData.data.selDate_set(timeSheetData[0].values[dayIndex]);

        GetProjects();
    }
    
    function kwndSaveWHs_OnClose() {
        var w= $("#kwndSaveWorkHours").data("kendoWindow");
        if(w) w.close();
    }
    
    function GetProjects() {
        $.ajax({
            type: "Get",
            url: "/api/ProjectsAPI/GetProjects",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: ddlProjects_OnInit,
            error: function (e) {
    
            }
        });
    }
    
    function ddlProjects_OnInit(response) {
    
        if (response.length == 0 ) {
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
            var kwndSaveWHs = $("#kwndSaveWorkHours");

            

            kwndSaveWHs.kendoWindow({
                width: "500px",
                height: moduleData.common.window_height(),

                activate: moduleData.common.addNoScrollToBody,
                deactivate: moduleData.common.removeNoScrollToBody ,
    
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
                close: ResetSaveWindow
            }).data("kendoWindow").center().open();
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
            success: ddlTasks_OnInit,
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
            ID: null,
            Date: moduleData.data.selDate_get().date,
            EmployeeID: null,
            TaskID: $("#ddlTasks").data("kendoDropDownList").value(),
            Hours: $("#ktpWorkHour").data("kendoTimePicker")._oldText,
            ProjectID: $("#ddlProjects").data("kendoDropDownList").value(),
            Description: $("#txtDescription").val()
        };
    
        if (!workHourJson.TaskID) {
            $("span[for='ddlTasks']").text("وظیفه ضروری است");
            return;
        }
    
        if (!workHourJson.Hours) {
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
        if(response.lenth > 0){
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
    }

    return {
        kwndSaveWHs_OnInit : kwndSaveWHs_OnInit,
        init: init
    };

})();




module.exports={
    
    'kwndSaveWHs_OnInit':module_createNewRorkHour.kwndSaveWHs_OnInit,
    'init':module_createNewRorkHour.init
}