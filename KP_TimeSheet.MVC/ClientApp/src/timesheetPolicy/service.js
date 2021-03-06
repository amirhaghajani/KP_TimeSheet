
var service = (function () {

    const moduleData = {};

    function init(common) {
        moduleData.common = common;
    }



    function savePolicy(policy, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/timesheetPlicy/SaveEditPolicy",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(policy),
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function deletePolicy(id, success_callBack, error_callBack) {
		$.ajax({
			type: "DELETE",
			url: "/api/timesheetPlicy/"+id,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function getDefualtConfigData(success_callBack, error_callBack) {
		$.ajax({
			type: "GET",
			url: "/api/timesheetPlicy/GetDefualtConfigData/",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function saveDefualtConfigData(defualtPolicy, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/timesheetPlicy/SaveDefualtConfigData",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(defualtPolicy),
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}




    return {
        init: init,
        savePolicy: savePolicy,
		deletePolicy: deletePolicy,
		getDefualtConfigData: getDefualtConfigData,
		saveDefualtConfigData: saveDefualtConfigData
    };

})();



module.exports = {
    init: service.init,
    savePolicy : service.savePolicy,
	deletePolicy: service.deletePolicy,

	getDefualtConfigData: service.getDefualtConfigData,
	saveDefualtConfigData: service.saveDefualtConfigData
}