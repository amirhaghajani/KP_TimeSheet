const service = (function () {

	const moduleData = {};

	function init(data, common_timeSheet, common) {
		moduleData.data = data;
		moduleData.common_timeSheet = common_timeSheet;
		moduleData.common= common;
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
			error: error_callBack ? () => error_callBack() : () => { }
		});

	}

	function getUsersInCurrentUserOrganisation(success_callBack, error_callBack) {

		$.ajax({
			type: "Get",
			url: "/api/TimeSheetsAPI/GetUsersInCurrentUserOrganisation",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (response) {
				moduleData.data.users_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});

	}

	function getTimeSheetsByUserIdForFirstTime(success_callBack, error_callBack) {

		$.ajax({
			type: "Get",
			url: "/api/Confirm/" +moduleData.common.version()+"/" + moduleData.data.userId_get(),
			contentType: "application/json; charset=utf-8",
			dataType: "json",

			success: function (response) {

				var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForApprove(response);

				moduleData.data.timeSheetDataConfirm_set(data);

				if (success_callBack) success_callBack(data);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});


		// $.ajax({
		// 	type: "Get",
		// 	url: "/api/TimeSheetsAPI/GetTimeSheetsByUserIdForFirstTime?UserId=" + moduleData.data.userId_get(),
		// 	contentType: "application/json; charset=utf-8",
		// 	dataType: "json",

		// 	success: function (response) {
		// 		if (response) {
		// 			response.forEach(element => {
		// 				element.uuiidd = element.uid;
		// 			});
		// 		}
		// 		//moduleData.data.timeSheetDataConfirm_set(response);
		// 		//if (success_callBack) success_callBack(response);
		// 	},
		// 	error: error_callBack ? () => error_callBack() : () => { }
		// });
	}





	function approveWorkHour(prmData, success_callBack, error_callBack) {

		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/ApproveWorkHour",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: success_callBack ? (response) => success_callBack(response) : () => { },
			error: error_callBack ? () => error_callBack() : () => { }
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
			error: error_callBack ? () => error_callBack() : () => { }
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
			error: error_callBack ? () => error_callBack() : () => { }
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
			error: error_callBack ? () => error_callBack() : () => { }
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
			error: error_callBack ? () => error_callBack() : () => { }
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
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function changeDisplayPeriodToWeeklyConfirm(success_callBack, error_callBack) {
		$.ajax({
			type: "Get",
			url: "/api/Confirm/ChangeDisplayPeriodToWeeklyConfirm",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: () => {
				if (success_callBack) success_callBack();
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function changeDisplayPeriodToDaily(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/confirm/ChangeDisplayPeriodToDaily",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: prmData,
			success: () => {
				if (success_callBack) success_callBack();
			},
			error: error_callBack ? () => error_callBack() : () => { }
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
			url: `/api/Confirm/${moduleData.common.version()}/${type}/${userId}/${date}`,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (response) => {

				var data = moduleData.common_timeSheet.convertServerDataToTimeSheet_ForApprove(response);

				moduleData.data.timeSheetDataConfirm_set(data);
				if (success_callBack) success_callBack(data);
			},
			error: error_callBack ? () => error_callBack() : () => { }
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
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}




	return {
		init: init,
		getTimeSheetsByUserId: getTimeSheetsByUserId,
		getUsersInCurrentUserOrganisation: getUsersInCurrentUserOrganisation,
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
	}

})();

module.exports = {
	init: service.init,
	getTimeSheetsByUserId: service.getTimeSheetsByUserId,
	getUsersInCurrentUserOrganisation: service.getUsersInCurrentUserOrganisation,
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
	getCurrentPeriodConfirm: service.getCurrentPeriodConfirm
}