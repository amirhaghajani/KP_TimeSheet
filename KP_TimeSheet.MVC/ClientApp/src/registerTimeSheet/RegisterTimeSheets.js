const common = require('../common/common');
const mainGrid = require('./mainGrid');
const priodlyGrid = require('./priodlyGrid');
const monthlyGrid = require('./monthlyGrid');
const data = require('./data');
const common_register = require('./common');
const period_next_pervious = require('./period_next_pervious');
const sended_workouts =require('./sended_workouts');
const editWindow=require('./editWindow');

//_____ متغیر ها و Document Ready__________

$(document).ready(function () {
    
    data.init();

    $('#registerTiemSheet_exportToExcel').off().on('click',function(){
        common.doExport('#ktrlTimeSheets', {type: 'excel'});
    });
    $('#registerTiemSheet_exportToDoc').off().on('click',function(){
        common.doExport('#ktrlTimeSheets', { type: 'doc' });
    });
    
    mainGrid.GetTimeSheets(function(){
        priodlyGrid.InitPeriodlyByProjectsGrid();
        monthlyGrid.InitMonthlyByProjectsGrid();
        common.LoaderHide();
        period_next_pervious.init();
        editWindow.init();
        sended_workouts.init();
    });
});

$('input:radio[name="optperiod"]').change(function () {

    EnableAndDisableSendPeriodRadioButton(this);

});

$("#numberDays").keyup(function () {

    if ($("#numberDays").val() > 25) {
        $("#numberDays").val("25");
    }
});

//________________ جهت باز سازی TreeList اصلی



function RefreshTimeSheet() {
    $.ajax({
        type: "Get",
        url: "/api/TimeSheetsAPI/GetTimeSheets",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ktrlTimeSheets_OnRefresh,
        error: function (e) {

        }
    });
}


function ktrlTimeSheets_OnRefresh(response) {

    data.timeSheetData_set(response);
    common_register.removeAndRecreateTreelisDiv();
    mainGrid.Init_TimeSheetTreeList();
    //$("#ktrlTimeSheets").data("kendoTreeList").dataSource.read();
    common.LoaderHide();
}

//________________




//_______________ساختن TreeList اصلی






//____________________________________



//__________________________________________





//_________________________






function exportTableToExcel(tableID, filename ){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}









//_____________________________________



function DeleteWorkHourSendGrid(e) {
    var grid = $("#GRDSendWorkHours").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));
    common.LoaderShow();
    var prmData = JSON.stringify(dataItem);
    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/DeleteWorkHours",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            Refresh_GRDSendWorkHour();
            RefreshTimeSheet();
            common.LoaderHide();
        },
        error: function (e) {
            alert(dataItem.ID);
        }
    });
}

function DeleteWorkHourEditGrid(e) {

    var grid = $("#GrdEditWorkHour").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));


    common.LoaderShow();


    var prmData = JSON.stringify(dataItem);

    $.ajax({
        type: "Post",
        url: "/api/TimeSheetsAPI/DeleteWorkHours",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: prmData,
        success: function (response) {
            editWindow.Refresh_GrdEditWorkHour();

            RefreshTimeSheet();
            common.LoaderHide();
        },
        error: function (e) {
            alert(dataItem.ID);
        }
    });



}


function EnableAndDisableSendPeriodRadioButton() {
    if ($("#numberDays").is(':disabled')) {

        $("#numberDays").prop("disabled", false);
        $("#startDate").prop("disabled", false);

    } else {
        $("#numberDays").prop("disabled", true);
        $("#startDate").prop("disabled", true);
    }

}

