
const timeSheet = (function () {

    function timeSheet_Row(id, parentId, title, type, uid, values) {
        this.id = id;
        this.parentId = parentId;
        this.title = title;
        this.type = type;
        this.uid = uid;
        this.UID = uid;
        this.uuiidd = uid;
        this.values = values;
    }

    function timeSheet_Time(date, persianDate, persianDay, projects) {
        this.date = date;
        this.persianDate = persianDate;
        this.persianDay = persianDay;
        this.projects = projects;
    }
    timeSheet_Time.prototype.calcTime = function () {
        var sum = 0;
        for (var i = 0; i < this.projects.length; i++) {
            sum += this.projects[i].calcTime();
        }
        return sum;
    }


    function timeSheet_Prject(id, title, workouts) {
        this.id = id;
        this.title = title;
        this.workouts = workouts;
    }
    timeSheet_Prject.prototype.calcTime = function () {
        var sum = 0;
        for (var i = 0; i < this.workouts.length; i++) {
            sum += this.workouts[i].hours;
        }
        return sum;
    }


    function timeSheet_Workout(id, title, hours, state) {
        this.id = id;
        this.title = title;
        this.hours = hours;
        this.state = state;
    }

    function convertNumberToTime(mainNumber) {
        if (!mainNumber) return '0:00';

        var number = Math.abs(mainNumber);

        const hour =  parseInt(number);
        const minut = Math.round((number - hour) * 60);
        return `${hour}:${minut > 9 ? minut : '0' + minut} ${mainNumber<0 ? '-' : ''}`;
    }
    function convertMinutsToTime(mainNumber) {
        if (!mainNumber) return '0:00';

        var number = Math.abs(mainNumber);

        const hour =  parseInt(number / 60);
        const minut = number - (hour * 60);
        return `${hour}:${minut > 9 ? minut : '0' + minut} ${mainNumber<0 ? '-' : ''}`;
    }



    function convertServerDataToTimeSheet_ForEmployee(response) {
        const data = [];

        const amaliat = new timeSheet_Row(0, null, "عملیات", "-", "eb96abcb-d37d-4aa1-1000-e1f4a753bee5", []);
        data.push(amaliat);

        const hozoor = new timeSheet_Row(1, null, "حضور", "-", "eb96abcb-d37d-4aa1-1001-e1f4a753bee5", []);
        data.push(hozoor);

        const hozoorDetail = new timeSheet_Row(2, 1, "جزئیات", "-", "eb96abcb-d37d-4aa1-1002-e1f4a753bee5", []);
        data.push(hozoorDetail);

        const karkard = new timeSheet_Row(3, null, "کارکرد", "-", "eb96abcb-d37d-4aa1-1003-e1f4a753bee5", []);
        data.push(karkard);

        const diffHozoorKarkard = new timeSheet_Row(4, null, "اختلاف حضور و کارکرد", "-", "eb96abcb-d37d-4aa1-1004-e1f4a753bee5", []);
        data.push(diffHozoorKarkard);

        debugger;
        const projects = [];
        const times = private_findTimesAndProjects(response, hozoor, hozoorDetail, karkard, diffHozoorKarkard, projects, null);

        private_addProjectsAndTasksTimes(data, times, projects, 3);

        const notSendId = data.length + 1
        const karkard_notSend = new timeSheet_Row(notSendId, null, "ارسال نشده", "-", "eb96abcb-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_notSend);


        const projects_notSendByEmployee = [];
        const times_notSend = private_findTimesAndProjects(response, null, null, karkard_notSend, null, projects_notSendByEmployee, "Resource");

        private_addProjectsAndTasksTimes(data, times_notSend, projects_notSendByEmployee, notSendId, true);


        const projects_approving = [];
        const times_approve = private_findTimesAndProjects(response, null, null, null, null, projects_approving, "Approving");

        const projects_final = [];
        const times_final = private_findTimesAndProjects(response, null, null, null, null, projects_final, "Final");

        private_addTimesForAmaliat(hozoor, karkard_notSend, karkard, amaliat);

        return data;
    }

    function private_addTimesForAmaliat(hozoor, noSend, mainKarkard, amalit) {

        const times = [];

        for (let i = 0; i < hozoor.values.length; i++) {
            const hozoorTodayTime = hozoor.values[i];
            const nosendTodayTime = noSend.values[i];
            const mainKarkardTodayTime = mainKarkard.values[i];

            amalit.values.push({
                date: hozoorTodayTime.date,
                persianDate: hozoorTodayTime.persianDate,
                persianDay: hozoorTodayTime.persianDay,
                title: hozoorTodayTime.persianDate,
                value: { isOpen: hozoorTodayTime.isOpen, has_NotSendData: !!nosendTodayTime.minute, hasKarkard: !!mainKarkardTodayTime.minute }
            });

        }


    }

    function convertServerDataToTimeSheet_ForApprove(response) {
        const data = [];

        const hozoor = new timeSheet_Row(1, null, "حضور", "-", "eb96abcb-d37d-4aa1-1000-e1f4a753bee5", []);
        data.push(hozoor);

        const hozoorDetail = new timeSheet_Row(2, 1, "جزئیات", "-", "eb96abcb-d37d-4aa1-1001-e1f4a753bee5", []);
        data.push(hozoorDetail);

        const karkard = new timeSheet_Row(3, null, "کارکرد", "-", "eb96abcb-d37d-4aa1-1002-e1f4a753bee5", []);
        data.push(karkard);

        const projects = [];
        const times = private_findTimesAndProjects(response, hozoor, hozoorDetail, karkard, null, projects, null);

        private_addProjectsAndTasksTimes(data, times, projects, 3);

        const taeedNashodeId = data.length + 1
        const karkard_notApprove = new timeSheet_Row(taeedNashodeId, null, "تایید نشده", "-", "eb96abcb-d37d-1001-0000-e1f4a753bee5", []);
        data.push(karkard_notApprove);

        const projects_notApprove = [];
        const times_notApprove = private_findTimesAndProjects(response, null, null, karkard_notApprove, null, projects_notApprove, "TaskNotApprove");

        private_addProjectsAndTasksTimes(data, times_notApprove, projects_notApprove, taeedNashodeId, true);

        return data;
    }

    function private_addProjectsAndTasksTimes(data, times, projects, parentId, isApprove) {

        if (projects.length == 0) return;

        const rowProjects = [];
        for (var i = 0; i < projects.length; i++) {
            const proj = projects[i];
            const pId = data.length + 1;
            var p = new timeSheet_Row(pId, parentId, proj.title, "Project", proj.id, []);
            data.push(p);
            rowProjects.push(p);

            p.workouts = [];

            for (var j = 0; j < proj.workouts.length; j++) {
                const workout = proj.workouts[j];
                var w = new timeSheet_Row(data.length + 1, pId, workout.title, isApprove ? workout.state : "Workout", workout.id, []);
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
                    value: convertNumberToTime(0)
                };
                r.workouts.forEach(w => {
                    const newItemForW = { ...newItem };
                    w.values.push(newItemForW);

                    if (i > -1) {
                        var wwIndex = t.projects[i].workouts.findIndex(ww => ww.id == w.uid);
                        if (wwIndex > -1) newItemForW.value = convertNumberToTime(t.projects[i].workouts[wwIndex].hours);
                    }

                })

                if (i > -1) {
                    newItem.value = convertNumberToTime(t.projects[i].calcTime());
                }

                r.values.push(newItem);

            });
        });
    }



    function private_findTimesAndProjects(response, hozoor, hozoorDetail, karkard, diffHozoorKarkard, projects, wantedState) {

        const times = [];

        for (let i = 0; i < response.length; i++) {
            const dbTime = response[i];
            const cTime = new timeSheet_Time(dbTime.date, dbTime.date_persian, dbTime.day_persian, []);
            times.push(cTime);

            for (let j = 0; j < dbTime.projects.length; j++) {
                const dbProject = dbTime.projects[j];
                const cProject = new timeSheet_Prject(dbProject.id, dbProject.title, []);


                let pIndex = projects.findIndex(p => p.id == cProject.id);
                let savedProject;
                let isNewSavedProject = false;
                if (pIndex == -1) {
                    savedProject = { id: cProject.id, title: cProject.title, workouts: [] };
                    isNewSavedProject = true;
                } else {
                    savedProject = projects[pIndex];
                }

                for (let k = 0; k < dbProject.workouts.length; k++) {
                    const dbWorkout = dbProject.workouts[k];

                    if (wantedState && dbWorkout.state != wantedState) continue;

                    let sumHours = dbWorkout.hours;

                    // for (let k2 = k + 1; k2 < dbProject.workouts.length; k2++) {
                    //     const dbWorkout2 = dbProject.workouts[k2];
                    //     if (dbWorkout2.id == dbWorkout.id && (!wantedState || cWorkout2.state == wantedState)) {
                    //         sumHours += dbWorkout2.hours;
                    //     }
                    // }

                    const cWorkout = new timeSheet_Workout(dbWorkout.id, dbWorkout.title, sumHours, dbWorkout.state);

                    cProject.workouts.push(cWorkout);

                    const index = savedProject.workouts.findIndex(p => p.id == cWorkout.id);
                    if (index == -1) {
                        savedProject.workouts.push({
                            id: cWorkout.id, title: cWorkout.title, state: cWorkout.state, hours: sumHours
                        })
                    } else {
                        savedProject.workouts[index].hours += sumHours;
                    }
                }

                if (cProject.workouts.length > 0) {
                    cTime.projects.push(cProject);
                    if (isNewSavedProject) projects.push(savedProject);
                }

            }

            if (hozoor) hozoor.values.push({
                date: cTime.date,
                persianDate: cTime.persianDate,
                persianDay: cTime.persianDay,
                title: cTime.persianDate,
                value: convertMinutsToTime(dbTime.hozoor),
                minute: dbTime.hozoor,
                isOpen: dbTime.isOpen
            });
            if (hozoorDetail) hozoorDetail.values.push({
                date: cTime.date,
                persianDate: cTime.persianDate,
                persianDay: cTime.persianDay,
                title: cTime.persianDate,
                value: dbTime.dayTimeString ? dbTime.dayTimeString : '-',
            });
            if (karkard) karkard.values.push({
                date: cTime.date,
                persianDate: cTime.persianDate,
                persianDay: cTime.persianDay,
                title: cTime.persianDate,
                value: convertNumberToTime(cTime.calcTime()),
                minute: cTime.calcTime()
            });
            if (diffHozoorKarkard) diffHozoorKarkard.values.push({
                date: cTime.date,
                persianDate: cTime.persianDate,
                persianDay: cTime.persianDay,
                title: cTime.persianDate,
                value: convertNumberToTime(dbTime.hozoor - cTime.calcTime()),
                minute: dbTime.hozoor - cTime.calcTime()
            });
        }

        return times;
    }



    return {
        convertServerDataToTimeSheet_ForEmployee: convertServerDataToTimeSheet_ForEmployee,
        convertServerDataToTimeSheet_ForApprove: convertServerDataToTimeSheet_ForApprove,
        convertNumberToTime: convertNumberToTime
    }

})();

module.exports = {
    convertServerDataToTimeSheet_ForEmployee: timeSheet.convertServerDataToTimeSheet_ForEmployee,
    convertServerDataToTimeSheet_ForApprove: timeSheet.convertServerDataToTimeSheet_ForApprove,
    convertNumberToTime: timeSheet.convertNumberToTime
};