const common = require('../common/common');
const common_register = require('./common');


//_____________________پنجره ذخیره

function kwndSaveWHs_OnInit(SaveWHsIdx) {

    $('#btnCancel_kwndSaveWHs').off().on('click',function(){
        kwndSaveWHs_OnClose();
    });
    $('#btnSaveWorkHours_kwndSaveWHs').off().on('click',function(){
        btnSaveWorkHours_Onclick();
    });

    var ktrlTimeSheets = $("#ktrlTimeSheets").data('kendoTreeList').dataItem($("#" + SaveWHsIdx).closest("tr"));
    _SelDate = ktrlTimeSheets.values[parseInt($("#" + SaveWHsIdx).attr('dayindex')) - 3];
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
        common.Notify("کاربر گرامی شما فاقد پروژه میباشید", "danger");
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
            height: "640px",

            scrollable: false,
            visible: false,
            modal: true,
            actions: [
                "Pin",
                "Minimize",
                "Maximize",
                "Close"
            ],
            open: common_register.adjustSize,
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
debugger;
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
    
    $("span[for='ktpWorkHour']").text("");
    $("span[for='ddlTasks']").text("");

    var workHourJson = {
        ID: null,
        Date: _SelDate.Date,
        EmployeeID: '',
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

    common.LoaderShow();

    kwndSaveWHs_OnClose();
    var prmData = JSON.stringify(workHourJson);

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/SaveWorkHours",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: SaveWorkHours_OnSuccess,
        error: function (e) {

        }
    });
}

function SaveWorkHours_OnSuccess(response) {

    GetCurrentPeriod();
    kwndSaveWHs_OnClose();
    if(response.lenth > 0){
        for (var i = 0; i < response.length; i++) {
            common.Notify(response[i], "danger");
        } 
    }
    else {
        common.Notify("ثبت کاکرد با موفقیت انجام شد", "success");
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


module.exports={
    'kwndSaveWHs_OnInit':kwndSaveWHs_OnInit
}