const common = require('../common/common');
const mainGrid = require('./mainGrid');
const priodlyGrid = require('./bottomPage_priodlyGrid');
const monthlyGrid = require('./bottomPage_monthlyGrid');
const data = require('./data');
const common_register = require('./common');
const period_next_pervious = require('./period_next_pervious');
const sended_workouts =require('./history_sentWorkHour');
const editWindow=require('./editWorkHour');

// Document Ready__________

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





