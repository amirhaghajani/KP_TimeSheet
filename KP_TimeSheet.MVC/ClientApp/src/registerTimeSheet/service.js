
var service = (function () {

    const moduleData = {};

    function init(data) {
        moduleData.data = data;
    }


    //اون اول اطلاعات کل تایم شیت ها را می دهد
    function getTimeSheets(success_callBack, error_callBack) {
        $.ajax({
            type: "Get",
            url: "/api/TimeSheetsAPI/GetTimeSheets",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (response) => {
                moduleData.data.timeSheetData_set(response);
                if (success_callBack) success_callBack(response);
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
        saveWorkHours: saveWorkHours
    };

})();



module.exports = {
    init: service.init,

    getTimeSheets: service.getTimeSheets,
    saveWorkHours: service.saveWorkHours
}