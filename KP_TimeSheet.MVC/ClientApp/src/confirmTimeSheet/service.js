const service = (function () {

	const moduleData = {};

	function init(data) {
		moduleData.data = data;
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
			url: "/api/Confirm/" + moduleData.data.userId_get(),
			contentType: "application/json; charset=utf-8",
			dataType: "json",

			success: function (response) {

				debugger;

				var data = [];

				var hozoor = new moduleData.data.timeSheet_Row(1, null, "حضور", "-", "eb96abcb-d37d-4aa1-1001-e1f4a753bee5", []);
				data.push(hozoor);

				var karkard = new moduleData.data.timeSheet_Row(2, null, "کارکرد", "-", "eb96abcb-d37d-4aa1-1002-e1f4a753bee5", []);
				data.push(karkard);

				const projects = [];
				const times = private_findTimesAndProjects(response, hozoor, karkard, projects);

				const rowProjects = [];
				for (var i = 0; i < projects.length; i++) {
					const proj = projects[i];
					const pId = (i + 1) * 100;
					var p = new moduleData.data.timeSheet_Row(pId, 2, proj.title, "Project", proj.id, []);
					data.push(p);
					rowProjects.push(p);

					p.workouts=[];

					for(var j=0;j<proj.workouts.length;j++){
						var w = new  moduleData.data.timeSheet_Row(pId+j+1, pId, proj.workouts[j].title, "Workout", proj.workouts[j].id, []);
						data.push(w);
						p.workouts.push(w)
					}
				}



				times.forEach(t => {

					rowProjects.forEach(r => {

						var i = t.projects.findIndex(p => r.uid == p.id);

						var newItem = {
							date: t.date,
							persianDate: t.persianDate,
							title: t.persianDate,
							value: "00:00"
						};
						r.workouts.forEach(w=>{
							const newItemForW = {...newItem};
							w.values.push(newItemForW);

							if (i > -1) {
								var wwIndex = t.projects[i].workouts.findIndex(ww=> ww.id == w.uid);
								if(wwIndex>-1) newItemForW.value = moduleData.data.convertNumberToTime(t.projects[i].workouts[wwIndex].hours);
							}

						})

						if (i > -1) {
							newItem.value = moduleData.data.convertNumberToTime(t.projects[i].calcTime());
						}

						r.values.push(newItem);

					});
				});


				moduleData.data.timeSheetDataConfirm_set(data);
				if (success_callBack) success_callBack(data);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});


		$.ajax({
			type: "Get",
			url: "/api/TimeSheetsAPI/GetTimeSheetsByUserIdForFirstTime?UserId=" + moduleData.data.userId_get(),
			contentType: "application/json; charset=utf-8",
			dataType: "json",

			success: function (response) {
				if (response) {
					response.forEach(element => {
						element.uuiidd = element.uid;
					});
				}
				//moduleData.data.timeSheetDataConfirm_set(response);
				//if (success_callBack) success_callBack(response);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function private_findTimesAndProjects(response, hozoor, karkard, projects) {

		const times = [];

		for (let i = 0; i < response.length; i++) {
			const dbTime = response[i];
			const cTime = new moduleData.data.timeSheet_Time(dbTime.date, dbTime.date_persian, []);
			times.push(cTime);

			for (let j = 0; j < dbTime.projects.length; j++) {
				const dbProject = dbTime.projects[j];
				const cProject = new moduleData.data.timeSheet_Prject(dbProject.id, dbProject.title, []);

				cTime.projects.push(cProject);
				let pIndex = projects.findIndex(p => p.id == cProject.id);
				let savedProject;
				if (pIndex == -1) {
					savedProject = { id: cProject.id, title: cProject.title, workouts: [] };
					projects.push(savedProject);
				} else {
					savedProject = projects[pIndex];
				}

				for (let k = 0; k < dbProject.workouts.length; k++) {
					const dbWorkout = dbProject.workouts[k];
					const cWorkout = new moduleData.data.timeSheet_Task(dbWorkout.id, dbWorkout.title, dbWorkout.hours, dbWorkout.state);

					cProject.workouts.push(cWorkout);
					if (savedProject.workouts.findIndex(p => p.id == cWorkout.id) == -1) savedProject.workouts.push({ id: cWorkout.id, title: cWorkout.title });
				}

			}


			hozoor.values.push({
				date: cTime.date,
				persianDate: cTime.persianDate,
				title: cTime.persianDate,
				value: moduleData.data.convertNumberToTime(dbTime.hozoor)
			});
			karkard.values.push({
				date: cTime.date,
				persianDate: cTime.persianDate,
				title: cTime.persianDate,
				value: moduleData.data.convertNumberToTime(cTime.calcTime())
			});

		}

		return times;
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
			url: "/api/TimeSheetsAPI/ChangeDisplayPeriodToWeeklyConfirm?UserId=" + moduleData.data.userId_get(),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (response) => {
				moduleData.data.timeSheetDataConfirm_set(response);
				if (success_callBack) success_callBack(response);
			},
			error: error_callBack ? () => error_callBack() : () => { }
		});
	}

	function getTimeSheetsByDateAndNumberOfDayConfirm(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetTimeSheetsByDateAndNumberOfDayConfirm",
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


	function getPreviousPeriodConfirm(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetPreviousPeriodConfirm",
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

	function getNextPeriodConfirm(prmData, success_callBack, error_callBack) {
		$.ajax({
			type: "Post",
			url: "/api/TimeSheetsAPI/GetNextPeriodConfirm",
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
		getTimeSheetsByDateAndNumberOfDayConfirm: getTimeSheetsByDateAndNumberOfDayConfirm,
		getPreviousPeriodConfirm: getPreviousPeriodConfirm,
		getCurrentPeriodConfirm: getCurrentPeriodConfirm,
		getNextPeriodConfirm: getNextPeriodConfirm
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
	getTimeSheetsByDateAndNumberOfDayConfirm: service.getTimeSheetsByDateAndNumberOfDayConfirm,
	getPreviousPeriodConfirm: service.getPreviousPeriodConfirm,
	getCurrentPeriodConfirm: service.getCurrentPeriodConfirm,
	getNextPeriodConfirm: service.getNextPeriodConfirm
}