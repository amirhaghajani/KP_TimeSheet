const service = (function () {

	const moduleData = {};

	function init(data, common_timeSheet, common) {
		moduleData.data = data;
		moduleData.common_timeSheet = common_timeSheet;
		moduleData.common = common;
	}

	function getTimeSheetsByUserId(prmData, success_callBack, error_callBack) {

		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetTimeSheetsByUserId",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: (response) => {
				moduleData.data.timeSheetDataConfirm_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});

	}

	function getSubUsersForApprove(success_callBack, error_callBack) {

		$.ajax({
			type: "Get",
			url: "/api/timesheetsNew/GetWaitingForApproveUsers",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (response) {
				moduleData.data.users_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});

	}

	function getTimeSheetsByUserIdForFirstTime(success_callBack, error_callBack) {

		$.ajax({
			type: "Get",
			url: "/api/timesheetsNew/" + moduleData.common.version() + "/" + moduleData.data.userId_get(),
			contentType: "application/json; charset=utf-8",
			dataType: "json",

			success: function (response) {

				var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForApprove(response);

				moduleData.data.timeSheetDataConfirm_set(data);

				if (success_callBack) success_callBack(data);
			},
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}


	function approveWorkHour(prmData, success_callBack, error_callBack) {

		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/ApproveWorkHour",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function denyWorkHour(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/DenyWorkHour",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function getThisMonthDataByUser(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetThisMonthDataByUser",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: (response) => {
				moduleData.data.thisMonthdataConfirm_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function getThisMonthProjectsByUserID(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetThisMonthProjectsByUserID",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function getThisPeriodDataByUserId(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetThisPeriodDataByUserId",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function getThisPeriodProjectsByUserId(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetThisPeriodProjectsByUserId",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function changeDisplayPeriodToWeeklyConfirm(success_callBack, error_callBack) {
		$.ajax({
			type: "Get",
			url: "/api/timesheetsNew/ChangeDisplayPeriodToWeeklyConfirm",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: () => {
				if (success_callBack) success_callBack();
			},
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function changeDisplayPeriodToDaily(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/timesheetsNew/ChangeDisplayPeriodToDaily",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: () => {
				if (success_callBack) success_callBack();
			},
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}


	function getPreviousNextPeriodConfirm(userId, startDate = null, toDate = null, success_callBack, error_callBack) {
		var type = "previous";
		let date = startDate;
		if (startDate == null) {
			type = "next";
			date = toDate;
		}
		$.ajax({
			type: "Get",
			url: `/api/timesheetsNew/${moduleData.common.version()}/${type}/${userId}/${date}`,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (response) => {

				var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForApprove(response);

				moduleData.data.timeSheetDataConfirm_set(data);
				if (success_callBack) success_callBack(data);
			},
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function getCurrentPeriodConfirm(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetCurrentPeriodConfirm",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: (response) => {
				moduleData.data.timeSheetDataConfirm_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}



	function getWaitingApproveWorkHourDetail(data, success_callBack, error_callBack) {

		let url = `/api/timesheetsNew/waitingApprove/${data.wantedUserId}/${data.startDate}/${data.endDate}`;
		if (data.projectId) url += `/${data.projectId}`;
		if (data.taskId) url += `/${data.taskId}`;

		$.ajax({
			type: "Get",
			url: url,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (response) => {
				response.forEach(a => a.minutes = moduleData.common_timeSheet.convertMinutsToTime(a.minutes));
				if (success_callBack) success_callBack(response);
			},
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}

	function getWaitingApproveMissionLeaveDetail(data, success_callBack, error_callBack) {

		let url = `/api/timesheetsNew/waitingApproveMissionLeave/${data.type}/${data.wantedUserId}/${data.startDate}/${data.endDate}`;

		$.ajax({
			type: "Get",
			url: url,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (response) => {
				if (success_callBack) success_callBack(response);
			},
			error: (error) => {
				moduleData.common.loaderHide();
				moduleData.common.notify(error.responseText ? error.responseText : JSON.stringify(error), 'danger');
				if (error_callBack) error_callBack();
			}
		});
	}


	function approveDenyItems(type, approveItemsIdsArray, denyItemsIdsArray, success_callBack, error_callBack) {

		if (type == 'workhour') type = 10;
		var data = { ver:moduleData.common.version(), type: type, approveIds: approveItemsIdsArray, denyIds: denyItemsIdsArray };

		$.ajax({
			type: "Post",
			url: "/api/timesheetsNew/approve",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(data),
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
		getTimeSheetsByUserId: getTimeSheetsByUserId,
		getSubUsersForApprove: getSubUsersForApprove,
		getTimeSheetsByUserIdForFirstTime: getTimeSheetsByUserIdForFirstTime,
		approveWorkHour: approveWorkHour,
		denyWorkHour: denyWorkHour,
		getThisMonthDataByUser: getThisMonthDataByUser,
		getThisMonthProjectsByUserID: getThisMonthProjectsByUserID,
		getThisPeriodDataByUserId: getThisPeriodDataByUserId,
		getThisPeriodProjectsByUserId: getThisPeriodProjectsByUserId,
		changeDisplayPeriodToWeeklyConfirm: changeDisplayPeriodToWeeklyConfirm,
		changeDisplayPeriodToDaily: changeDisplayPeriodToDaily,
		getPreviousNextPeriodConfirm: getPreviousNextPeriodConfirm,
		getCurrentPeriodConfirm: getCurrentPeriodConfirm,
		getWaitingApproveWorkHourDetail: getWaitingApproveWorkHourDetail,
		getWaitingApproveMissionLeaveDetail: getWaitingApproveMissionLeaveDetail,
		approveDenyItems: approveDenyItems
	}

})();

module.exports = {
	init: service.init,
	getTimeSheetsByUserId: service.getTimeSheetsByUserId,
	getSubUsersForApprove: service.getSubUsersForApprove,
	getTimeSheetsByUserIdForFirstTime: service.getTimeSheetsByUserIdForFirstTime,
	approveWorkHour: service.approveWorkHour,
	denyWorkHour: service.denyWorkHour,
	getThisMonthDataByUser: service.getThisMonthDataByUser,
	getThisMonthProjectsByUserID: service.getThisMonthProjectsByUserID,
	getThisPeriodDataByUserId: service.getThisPeriodDataByUserId,
	getThisPeriodProjectsByUserId: service.getThisPeriodProjectsByUserId,
	changeDisplayPeriodToWeeklyConfirm: service.changeDisplayPeriodToWeeklyConfirm,
	changeDisplayPeriodToDaily: service.changeDisplayPeriodToDaily,
	getPreviousNextPeriodConfirm: service.getPreviousNextPeriodConfirm,
	getCurrentPeriodConfirm: service.getCurrentPeriodConfirm,
	getWaitingApproveWorkHourDetail: service.getWaitingApproveWorkHourDetail,
	getWaitingApproveMissionLeaveDetail: service.getWaitingApproveMissionLeaveDetail,
	approveDenyItems: service.approveDenyItems
}