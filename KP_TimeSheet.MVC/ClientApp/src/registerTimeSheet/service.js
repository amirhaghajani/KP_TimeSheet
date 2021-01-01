
var service = (function () {

    const moduleData = {};

    function init(data, common_timeSheet) {
        moduleData.data = data;
        moduleData.common_timeSheet = common_timeSheet;
    }


    //اون اول اطلاعات کل تایم شیت ها را می دهد
    function getTimeSheets(fromDate,toDate, success_callBack, error_callBack) {

        let url = "/api/Confirm/employee";

        if(fromDate){
            url = `/api/Confirm/employeeTimeSheet/${fromDate}/${toDate}`;
        }

        $.ajax({
			type: "Get",
			url: url,
			contentType: "application/json; charset=utf-8",
			dataType: "json",

			success: function (response) {
                
				var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForEmployee(response);

                moduleData.data.timeSheetData_set(data);
                if (success_callBack) success_callBack(data);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
    }

    function getNextTimeSheets(type,date, success_callBack, error_callBack) {

        $.ajax({
			type: "Get",
			url: `/api/Confirm/employee/${type}/${date}`,
			contentType: "application/json; charset=utf-8",
			dataType: "json",

			success: function (response) {
                
				var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForEmployee(response);

                moduleData.data.timeSheetData_set(data);
                if (success_callBack) success_callBack(data);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
    }


    function saveWorkHours(prmData, success_callBack, error_callBack){
        $.ajax({
            type: "Post",
            url: "/api/TimeSheetsAPI/SaveWorkHours",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: prmData,
            success: success_callBack ? (response) => success_callBack(response) : ()=>{},
            error: error_callBack ? () => error_callBack() : () => { }
        });
    }

    return {
        init: init,

        getTimeSheets: getTimeSheets,
        saveWorkHours: saveWorkHours,

        getNextTimeSheets: getNextTimeSheets
    };

})();



module.exports = {
    init: service.init,

    getTimeSheets: service.getTimeSheets,
    saveWorkHours: service.saveWorkHours,

    getNextTimeSheets: service.getNextTimeSheets
}