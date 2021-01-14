const common = require('../common/common');
const common_register = require('./common');
const data = require('./data');
const createNewWorkHour = require('./createNewWorkHour');
const mainGrid = require('./mainGrid');
const bottomPage_priodlyGrid = require('./bottomPage_priodlyGrid');
const bottomPage_monthlyGrid = require('./bottomPage_monthlyGrid');


const period_next_pervious = require('./period_next_pervious');
const history_sentWorkHour = require('./history_sentWorkHour');
const editWindow = require('./editWorkHour');
const history_workHour = require('./hisotory_workHour');
const sendWorkHour = require('./sendWorkHour');

const common_timeSheet = require('../common/timesheet');

const service = require('./service');
const serviceConfirm = require('../confirmTimeSheet/service');

const hourlyMission = require('./mission_hourly');




// Document Ready__________

$(document).ready(function () {

    common.loaderShow();

    data.init();
    bottomPage_monthlyGrid.init(data, common_timeSheet);
    bottomPage_priodlyGrid.init(data, common_timeSheet);
    service.init(data, common_timeSheet, common);

    $('#registerTiemSheet_exportToExcel').off().on('click', function () {
        common.doExport('#ktrlTimeSheets', { type: 'excel' });
    });
    $('#registerTiemSheet_exportToDoc').off().on('click', function () {
        common.doExport('#ktrlTimeSheets', { type: 'doc' });
    });

    editWindow.init(mainGrid, common, common_register, data, common_timeSheet, service);
    history_sentWorkHour.init(common, common_register, history_workHour, data, common_timeSheet, createNewWorkHour);

    mainGrid.init(common, common_register, common_timeSheet, createNewWorkHour, history_sentWorkHour, sendWorkHour, data, 
        service, editWindow,history_sentWorkHour, bottomPage_priodlyGrid, bottomPage_monthlyGrid);

    mainGrid.GetTimeSheets(function () {
        bottomPage_priodlyGrid.InitPeriodlyByProjectsGrid();
        bottomPage_monthlyGrid.InitMonthlyByProjectsGrid();
        common.loaderHide();

        period_next_pervious.init(common, common_register, mainGrid,
            bottomPage_monthlyGrid, history_sentWorkHour, bottomPage_priodlyGrid, editWindow, data, service,serviceConfirm);

        createNewWorkHour.init(common, common_register, period_next_pervious, data, service,common_timeSheet);
        sendWorkHour.init(mainGrid, common, common_register, data, common_timeSheet);

        history_workHour.init(common, data);

        hourlyMission.init(common,data,service);
        
    });
});




function exportTableToExcel(tableID, filename) {
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

    // Specify file name
    filename = filename ? filename + '.xls' : 'excel_data.xls';

    // Create download link element
    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
    }
}





