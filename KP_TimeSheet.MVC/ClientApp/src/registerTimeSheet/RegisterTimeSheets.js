﻿const common = require('../common/common');
const common_register = require('./common');
const data = require('./data');
const createNewWorkHour = require('./createNewWorkHour');
const my_mainGrid = require('./my_mainGrid');
const priodlyGrid = require('./bottomPage_priodlyGrid');
const monthlyGrid = require('./bottomPage_monthlyGrid');


const period_next_pervious = require('./period_next_pervious');
const history_sentWorkHour =require('./history_sentWorkHour');
const editWindow=require('./editWorkHour');
const history_workHour = require('./hisotory_workHour');
const sendWorkHour = require('./sendWorkHour');




// Document Ready__________

$(document).ready(function () {

    data.init();
    monthlyGrid.init(data);
    priodlyGrid.init(data);

    $('#registerTiemSheet_exportToExcel').off().on('click',function(){
        common.doExport('#ktrlTimeSheets', {type: 'excel'});
    });
    $('#registerTiemSheet_exportToDoc').off().on('click',function(){
        common.doExport('#ktrlTimeSheets', { type: 'doc' });
    });
    
    my_mainGrid.init(createNewWorkHour,history_sentWorkHour,sendWorkHour,data);

    my_mainGrid.GetTimeSheets(function(){
        priodlyGrid.InitPeriodlyByProjectsGrid();
        monthlyGrid.InitMonthlyByProjectsGrid();
        common.LoaderHide();
        period_next_pervious.init(common, common_register,my_mainGrid,
            monthlyGrid,history_sentWorkHour, priodlyGrid,editWindow, data);
            
        editWindow.init(common_register,data);
        history_sentWorkHour.init(Comment,common_register,history_workHour,data);
        createNewWorkHour.init(common,common_register,period_next_pervious,data);
        history_workHour.init(data);
        sendWorkHour.init(common_register,data);
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





